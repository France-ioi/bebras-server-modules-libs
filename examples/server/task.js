var tools = require('../../bebras_tools')
var jwt = require('jsonwebtoken')

var taskInterface = tools.connect({
    host: 'http://localhost:3000'
}).taskInterface({
    platform_id: 1,
    token: jwt.sign({
        id: 'test-server-modules',
        random_seed: 1,
        hints_requested: [
            'test'
        ]
    }, 'buddy')
})

var key = 'test_key'


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


function gradeAnswer(callback) {
    console.log('taskInterface.gradeAnswer')
    taskInterface.gradeAnswer({
        answer_token: jwt.sign('answer_string', 'buddy'),
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