var tools = require('../../bebras_tools')

var host = 'http://localhost:3000'
var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicmFuZG9tX3NlZWQiOjEsImhpbnRzUmVxdWVzdGVkIjp7ImEiOiJhIiwiYiI6ImIifSwiaWF0IjoxNTA5OTgxNDI2fQ.0TvHW94yWDFr0QuOC9C45JW1QopAZCAtXeTKrFA6yN8'
var platform_id = 1

var taskInterface = tools.connect({ host}).taskInterface({ platform_id, token})


function taskData(callback) {
    console.log('taskInterface.taskData')
    taskInterface.taskData({
        success: (res) => {
            console.log('Result', res)
            callback && callback()
        },
        error: (error) => {
            console.error(error)
        }
    })
}


function taskHintData(callback) {
    console.log('taskInterface.taskHintData')
    taskInterface.taskHintData({
        success: (res) => {
            console.log('Result', res)
            callback && callback()
        },
        error: (error) => {
            console.error(error)
        }
    })
}


var answer_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZXN0X2Fuc3dlcl92YWx1ZSI6InRlc3QiLCJpYXQiOjE1MDk5ODg0MDB9.47Pf_YkAS4DHym7YDDqK6URhvWEuoOeCu_09hG_wY3A'

function gradeAnswer(callback) {
    console.log('taskInterface.gradeAnswer')
    taskInterface.gradeAnswer({
        answer_token,
        min_score: 1,
        max_score: 100,
        no_score: 0,
        success: (res) => {
            console.log('Result', res)
            callback && callback()
        },
        error: (error) => {
            console.error(error)
        }
    })
}



taskData(() => {
    taskHintData(() => {
        gradeAnswer()
    })
})