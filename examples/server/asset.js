var tools = require('../../bebras_tools')
var jwt = require('jsonwebtoken')

var assetsPublisher = tools.connect({
    host: 'http://localhost:3000'
}).assetsPublisher({
    platform_id: 1,
    token: jwt.sign({
        id: 'test-server-modules',
        random_seed: 1
    }, 'buddy')
})

var key = 'test_key'


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