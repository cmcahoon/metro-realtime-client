'use strict'

let request = require('../request')
let baseURL = require('../constants').baseEndpointURL


exports.list = function(agency) {
    return request
        .get(baseURL + '/agencies/' + agency + '/routes/')
        .promise()
        .then(request.callback.onResponse)
        .catch(request.callback.onError)
}