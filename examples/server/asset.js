var tools = require('../../bebras_tools')

var host = 'http://localhost:3000'
var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicmFuZG9tX3NlZWQiOjEsImhpbnRzUmVxdWVzdGVkIjp7ImEiOiJhIiwiYiI6ImIifSwiaWF0IjoxNTA5OTgxNDI2fQ.0TvHW94yWDFr0QuOC9C45JW1QopAZCAtXeTKrFA6yN8'
var platform_id = 1
var key = 'test_key'

var assetsPublisher = tools.connect({ host}).assetsPublisher({ platform_id, token})


function assetAdd(callback) {
    console.log('assetsPublisher.add')
    assetsPublisher.add({
        key,
        data: tools.dataReader(__dirname + '/file.txt'),
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