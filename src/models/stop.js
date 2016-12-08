'use strict'

let request = require('../request')
let baseURL = require('../constants').baseEndpointURL


exports.list = function(agency, route) {
    return request
        .get(baseURL + '/agencies/' + agency + '/routes/' + route + '/stops/')
        .promise()
        .then(request.callback.onResponse)
        .catch(request.callback.onError)
}
