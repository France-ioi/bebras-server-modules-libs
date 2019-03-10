(function(task) {

    // grade
    function useGraderData(url, answer, callback) {
        if(window.QuizzeGrader && window.QuizzeGrader.data) {
            callback(window.QuizzeGrader.grade(window.QuizzeGrader.data, answer));
            return;
        }
        $.getScript(url)
            .done(function(script, textStatus ) {
                try {
                    window.QuizzeGrader.data = eval(script)

                } catch(e) {
                    console.error('Malformed grader data in ' + url);
                    return
                }
                callback(window.QuizzeGrader.grade(window.QuizzeGrader.data, answer));
            }).fail(function( jqxhr, settings, exception ) {
                console.error('Can\'t load grader data: ' + url);
            });
    }


    function useGraderUrl(url, task_token, answer, callback) {
        var data = {
            action: 'grade',
            task: task_token,
            answer: answer
        }
        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(data),
            crossDomain: true,
            contentType: 'application/json'
        }).done(function(res) {
            if(res.success) {
                return callback(res.data);
            }
            console.error('Grader response error: ', res);
        }).fail(function(jqxhr, settings, exception ) {
            console.error('Grader url not responding: ' + url);
        });
    }




    var task_token = {

        token: null,

        init: function() {
            var query = document.location.search.replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
            this.token = query.sToken || '';
        },

        get: function() {
            return this.token
        },
    }




    task.load = function(views, taskLoadCallback) {
        task_token.init()

        platform.getTaskParams(null, null, function(taskParams) {
            var q = QuizzeUI({
                parent: $('#task'),
                shuffle_questions: 0, //true,
                shuffle_answers: 0, //true,
                random: parseInt(taskParams.randomSeed, 10) || 0
            });

            task.getAnswer = function(callback) {
                callback(q.getAnswer());
            };

            task.reloadAnswer = function(answer, callback) {
                q.setAnswer(answer);
                callback();
            };

            task.hackShowViews = function(views) {
                q.toggleSolutions(!!views.solution);
            }

            task.gradeAnswer = function(answer, answer_token, callback) {
                function onGrade(result) {
                    var d = taskParams.maxScore - taskParams.minScore;
                    var final_score = Math.max(
                        taskParams.minScore + Math.round(d * result.score),
                        taskParams.noScore || 0
                    );
                    q.showMistakes(result.mistakes);
                    callback(final_score, 'Your score is ' + final_score, null);
                }
                var token = task_token.get()
                if(token) {
                    useGraderUrl(json.graderUrl, token, answer, onGrade);
                } else if(json.graderUrl) {
                    useGraderData(json.graderData, answer, onGrade);
                }
            };
            taskLoadCallback();
        });
    };


    task.getLevelGrade = function(answer, answerToken, callback, gradedLevel) {
        task.gradeAnswer(answer, answerToken, callback);
    }


    var height = null;
    setInterval(function() {
        task.getHeight(function(h) {
            if(h !== height) {
                height = h;
                platform.updateDisplay({
                    height: height
                }, function() {});
            }
        });
    }, 1000)

})(task)