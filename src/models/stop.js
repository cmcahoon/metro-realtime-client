'use strict'

const _ = require('lodash')
const Promise = require('../promise')
let request = require('../request')
let baseURL = require('../constants').baseEndpointURL


// helpers

function getInfo(agencyId, stopId) {
    return request
        .get(baseURL + '/agencies/' + agencyId + '/stops/' + stopId + '/info/')
        .promise()
        .then(request.callback.onResponse)
        .catch(request.callback.onError)
}

function getRoutes(agencyId, stopId) {
    return request
        .get(baseURL + '/agencies/' + agencyId + '/stops/' + stopId + '/routes/')
        .promise()
        .then(request.callback.onResponse)
        .catch(request.callback.onError)
}

function getMessages(agencyId, stopId) {
    return request
        .get(baseURL + '/agencies/' + agencyId + '/stops/' + stopId + '/messages/')
        .promise()
        .then(request.callback.onResponse)
        .catch(request.callback.onError)
}

function getPredictions(agencyId, stopId) {
    return request
        .get(baseURL + '/agencies/' + agencyId + '/stops/' + stopId + '/predictions/')
        .promise()
        .then(request.callback.onResponse)
        .catch(request.callback.onError)
}


// transformers

function merge(info, routes, messages, predictions) {
    return _(info)
        .set('routes', routes.items)
        .set('messages', messages.items)
        .set('predictions', predictions.items)
        .value()
}


// exports

exports.list = function(agencyId, routeId) {
    return request
        .get(baseURL + '/agencies/' + agencyId + '/routes/' + routeId + '/stops/')
        .promise()
        .then(request.callback.onResponse)
        .then(_.partial(_.get, _, 'items'))
        .catch(request.callback.onError)
}


exports.get = function(agencyId, stopId) {
    return Promise.resolve([
        getInfo(agencyId, stopId),
        getRoutes(agencyId, stopId),
        getMessages(agencyId, stopId),
        getPredictions(agencyId, stopId)
    ])
    .all()
    .spread(merge)
}
