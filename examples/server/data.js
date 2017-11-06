var BebrasTools = require('../../bebras_tools')
var fs = require('fs')
var mime = require('mime')

var host = 'http://localhost:3000'
var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicmFuZG9tX3NlZWQiOjEsImhpbnRzUmVxdWVzdGVkIjp7ImEiOiJhIiwiYiI6ImIifSwiaWF0IjoxNTA5OTgxNDI2fQ.0TvHW94yWDFr0QuOC9C45JW1QopAZCAtXeTKrFA6yN8'
var platform_id = 1

var server = new BebrasTools.Server({ host })
var dataStore = server.dataStore({ platform_id, token})
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