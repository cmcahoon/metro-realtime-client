'use strict'

const _ = require('lodash')
const Promise = require('bluebird')
let request = require('../request')
let baseURL = require('../constants').baseEndpointURL


exports.list = function(agency, route) {
    if (_.isNil(agency))
        return Promise.reject('an agency must be specified')

    let url = _.isNil(route) ?
        baseURL + '/agencies/' + agency + '/vehicles/' :
        baseURL + '/agencies/' + agency + '/routes/' + route + '/vehicles/'

    return request
        .get(url)
        .promise()
        .then(request.callback.onResponse)
        .then(_.partial(_.get, _, 'items'))
        .catch(request.callback.onError)
}
