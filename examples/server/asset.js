var BebrasTools = require('../../bebras_tools')
var fs = require('fs')
var mime = require('mime')

var host = 'http://localhost:3000'
var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicmFuZG9tX3NlZWQiOjEsImhpbnRzUmVxdWVzdGVkIjp7ImEiOiJhIiwiYiI6ImIifSwiaWF0IjoxNTA5OTgxNDI2fQ.0TvHW94yWDFr0QuOC9C45JW1QopAZCAtXeTKrFA6yN8'
var platform_id = 1

var server = new BebrasTools.Server({ host })
var assetsPublisher = server.assetsPublisher({ platform_id, token})
var key = 'test_key'




function assetAdd(callback) {
    var path = __dirname + '/file.txt'
    var content = fs.readFileSync(path, { encoding: 'base64'})
    var content_type = mime.getType(path)
    console.log('assetsPublisher.add')
    assetsPublisher.add({
        key,
        data: 'data:' + content_type + ';base64,' + content,
        success: (res) => {
            console.log('Done')
            callback && callback()
        },
        error: (error) => {
            console.error(error)
        }
    })
}


function assetGetUrl(callback) {
    console.log('assetsPublisher.getUrl')
    assetsPublisher.getUrl({
        key,
        success: (res) => {
            console.log('Result', res)
            callback && callback()
        },
        error: (error) => {
            console.error(error)
        }
    })
}


function assetDelete(callback) {
    console.log('assetsPublisher.delete')
    assetsPublisher.delete({
        key,
        success: (res) => {
            console.log('Done')
            callback && callback()
        },
        error: (error) => {
            console.error(error)
        }
    })
}




assetAdd(() => {
    assetGetUrl(() => {
        assetDelete(() => {
            assetGetUrl()
        })
    })
})