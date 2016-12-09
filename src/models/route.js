'use strict'

let request = require('../request')
let baseURL = require('../constants').baseEndpointURL
let models = {
    stop: require('./stop'),
}


exports.list = function(agencyId) {
    return request
        .get(baseURL + '/agencies/' + agencyId + '/routes/')
        .promise()
        .then(request.callback.onResponse)
        .catch(request.callback.onError)
}


exports.get = function(agencyId, routeId) {
    return request
        .get(baseURL + '/agencies/' + agencyId + '/routes/' + routeId + '/')
        .promise()
        .then(request.callback.onResponse)
        .catch(request.callback.onError)
}