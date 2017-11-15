function BebrasTaskWrapper(task, options) {

    var taskInterface = BebrasTools.connect({
        host: options.host
    }).taskInterface({
        platform_id: options.platform_id
    })


    var task_token = {

        error_delay: 1000,
        token: null,
        timeout: null,
        callbacks: {},

        get: function(success, error) {
            this.reset()
            if(this.token) {
                return success(this.token)
            }
            this.callbacks = {
                success: success,
                error: error
            }
            this.timeout = setTimeout((function() {
                this.callbacks.error && this.callbacks.error('Error, task token was not received')
            }).bind(this), this.error_delay)
        },

        set: function(token) {
            this.callbacks.success && this.callbacks.success(token)
            this.token = token
            this.reset()
        },

        empty: function() {
            this.token = null
            this.reset()
        },

        reset: function() {
            clearTimeout(this.timeout)
            this.callbacks = {}
        }
    }




    function loadHint(token) {
        taskInterface.taskHintData({
            token: token,
            success: function(res) {
                task.onTaskHintData && task.onTaskHintData(res)
            },
            error: function(error) {
                task.onTaskHintError && task.onTaskHintError(error)
            }
        })
    }



    task.load = function(views, success, error) {
        task_token.get(
            function(token) {
                task.onLoad && task.onLoad()
                taskInterface.taskData({
                    token: token,
                    success: function(res) {
                        task.onTaskData && task.onTaskData(res)
                        success && success()
                    },
                    error: function(msg) {
                        error && error(msg)
                    }
                })
            },
            function(msg) {
                error && error(msg)
            }
        )
    }


    task.unload = function(success, error) {
        task_token.reset()
        task.onUnload ? task.onUnload(success, error) : success()
    }


    task.updateToken = function(token, callback)  {
        task_token.set(token)
        callback && callback()
    }


    task.askHint = function(hint_params) {
        task_token.empty()
        platform.askHint(
            hint_params,
            function() {
                task_token.get(
                    loadHint,
                    function(msg) {
                        console.error(msg)
                    }
                )
            },
            function() {
                console.error('platform.askHint error')
            }
        )
    }


    task.gradeAnswer = function(answer, answer_token, callback, error) {
        task_token.get(
            function(task_token) {
                platform.getTaskParams(null, null, function(taskParams) {
                    taskInterface.gradeAnswer({
                        token: task_token,
                        answer_token: answer_token,
                        min_score: taskParams.minScore,
                        max_score: taskParams.maxScore,
                        no_score: taskParams.noScore,
                        success: function(res) {
                            callback(res.score, res.message)
                        },
                        error: function(msg) {
                            console.error(msg)
                            error && error()
                        }
                    })
                })
            },
            function(msg) {
                console.error(msg)
                error && error()
            }
        )
    }


}