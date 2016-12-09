'use strict'

let Promise = require('./promise')
let request = require('superagent-bluebird-promise')


let onResponse = function(res) {
    return Promise.resolve(res.body)
}


let onError = function(err) {
    /**
     * All errors have the 'error' key. 400 and 500 errors also have 
     * a 'status' and 'res' key.
     */
    return Promise.reject({
        message: err.error,
        status: err.status,
        response: err.res
    })
}


module.exports = Object.assign(request, {
    callback: {
        onResponse: onResponse,
        onError: onError
    }
})