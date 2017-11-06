(function(exports){

    exports.Server = function(config) {

        if(typeof require !== 'undefined') {
            var fetch = require('isomorphic-fetch')
        }


        function post(url, data, success, error) {
            if(typeof $ !== 'undefined') {
                $.ajax({
                    type: 'POST',
                    url: url,
                    data: data,
                    success: success,
                    error: error,
                    dataType: 'json'
                })
            } else if(typeof fetch !== 'undefined') {
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }).then(function(response) {
                    return response.json()
                }).then(function(json) {
                    success(json)
                }).catch(function(ex) {
                    error(ex)
                })
            } else {
                console.error('isomorphic-fetch or jQuery not found')
            }
        }


        function encodeFile(file, callback) {
            var reader  = new FileReader()
            reader.onloadend = function() {
                callback(reader.result)
            }
            reader.readAsDataURL(file)
        }


        function prepareRequestParams(service_data, params, callback) {
            var res = {
                callbacks: {
                    done: function(res) {
                        console.log('BebrasServer response', res)
                    },
                    error: function(res) {
                        console.error('BebrasServer error', res)
                    }
                },
                data: service_data
            }

            var file = false
            for(var k in params) {
                if(typeof params[k] == 'function') {
                    res.callbacks[k] = params[k]
                } else if(typeof File !== 'undefined' && params[k] instanceof File) {
                    // browser
                    var file = k
                } else {
                    res.data[k] = '' + params[k]
                }
            }

            if(file) {
                encodeFile(params[file], function(data) {
                    res.data[file] = data
                    callback(res)
                })
            } else {
                callback(res)
            }
        }


        function createRequest(service, action, options) {
            return function(params) {
                prepareRequestParams(
                    {
                        action: action,
                        token: options.token,
                        platform_id: options.platform_id
                    },
                    params,
                    function(req) {
                        post(
                            config.host + '/' + service,
                            req.data,
                            function(res) {
                                if(res && res.success) {
                                    req.callbacks.success(res.data)
                                } else {
                                    req.callbacks.error(res.error)
                                }
                            },
                            function(res) {
                                req.callbacks.error('Server not responding')
                            }
                        )
                    }
                )
            }
        }

        var DataStore = function(options) {
            this.write = createRequest('data', 'write', options)
            this.read = createRequest('data', 'read', options)
            this.delete = createRequest('data', 'delete', options)
            this.empty = createRequest('data', 'empty', options)
        }


        this.dataStore = function(options) {
            return new DataStore(options)
        }


        var AssetsPublisher = function(options) {
            this.add = createRequest('asset', 'add', options)
            this.getUrl = createRequest('asset', 'url', options)
            this.delete = createRequest('asset', 'delete', options)
            this.empty = createRequest('asset', 'empty', options)
        }

        this.assetsPublisher = function(options) {
            return new AssetsPublisher(options)
        }



        var TaskInterface = function(options) {
            this.taskData = createRequest('task', 'taskData', options)
            this.taskHintData = createRequest('task', 'taskHintData', options)
            this.gradeAnswer = createRequest('task', 'gradeAnswer', options)
        }

        this.taskInterface = function(options) {
            return new TaskInterface(options)
        }

    }

})(typeof exports === 'undefined'? this['BebrasTools'] = {} : exports)