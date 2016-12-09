'use strict'

const _ = require('lodash')
let request = require('../request')
let baseURL = require('../constants').baseEndpointURL


exports.list = function(agency) {
    return request
        .get(baseURL + '/agencies/' + agency + '/vehicles/')
        .promise()
        .then(request.callback.onResponse)
        .then(_.partial(_.get, _, 'items'))
        .catch(request.callback.onError)
}
