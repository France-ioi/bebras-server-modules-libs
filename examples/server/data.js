var tools = require('../../bebras_tools')
var jwt = require('jsonwebtoken')

var dataStore = tools.connect({
    host: 'http://localhost:3000'
}).dataStore({
    platform_id: 1,
    token: jwt.sign({
        id: 'test-server-modules',
        random_seed: 1
    }, 'buddy')
})

var key = 'test_key'


function dataWrite(callback) {
    console.log('dataStore.write')
    dataStore.write({
        key,
        value: 'test_value',
        duration: 0,
        success: (res) => {
            console.log('Done')
            callback && callback()
        },
        error: (error) => {
            console.error(error)
        }
    })
}


function dataRead(callback) {
    console.log('dataStore.read')
    dataStore.read({
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


function dataDelete(callback) {
    console.log('dataStore.delete')
    dataStore.delete({
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



dataWrite(() => {
    dataRead(() => {
        dataDelete(() => {
            dataRead()
        })
    })
})