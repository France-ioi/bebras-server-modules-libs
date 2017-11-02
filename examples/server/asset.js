var BebrasTools = require('../../bebras_tools')
var fs = require('fs')
var mime = require('mime')

var host = 'http://localhost:3000'
var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YXNrX2lkIjoxLCJyYW5kb21fc2VlZCI6MiwiaWF0IjoxNTA4OTc0NjgzfQ.SCUPPsBqUbzfmgvwrdk2ipNAseVnabcQWjxxXBErNIo'
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