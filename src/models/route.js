'use strict'

const _ = require('lodash')
const Promise = require('bluebird')
let request = require('../request')
let baseURL = require('../constants').baseEndpointURL

// helpers

function getInfo(agencyId, routeId) {
    return request
        .get(baseURL + '/agencies/' + agencyId + '/routes/' + routeId + '/')
        .promise()
        .then(request.callback.onResponse)
        .catch(request.callback.onError)
}

function getStops(agencyId, routeId) {
    return request
        .get(baseURL + '/agencies/' + agencyId + '/routes/' + routeId + '/stops/')
        .promise()
        .then(request.callback.onResponse)
        .catch(request.callback.onError)
}

function getStopSequence(agencyId, routeId) {
    return request
        .get(baseURL + '/agencies/' + agencyId + '/routes/' + routeId + '/sequence/')
        .promise()
        .then(request.callback.onResponse)
        .catch(request.callback.onError)
}

function getRuns(agencyId, routeId) {
    return request
        .get(baseURL + '/agencies/' + agencyId + '/routes/' + routeId + '/runs/')
        .promise()
        .then(request.callback.onResponse)
        .catch(request.callback.onError)
}


// transformers

function merge(info, stops, stopSequence, runs) {
    return _(info)
        .set('stops', stops.items)
        .set('stop_sequence', stopSequence.items)
        .set('runs', runs.items)
        .value()
}


// exports

exports.list = function(agencyId) {
    if (_.isNil(agencyId))
        return Promise.reject('an agency must be specified')

    return request
        .get(baseURL + '/agencies/' + agencyId + '/routes/')
        .promise()
        .then(request.callback.onResponse)
        .then(_.partial(_.get, _, 'items'))
        .catch(request.callback.onError)
}


exports.get = function(agencyId, routeId) {
    if (_.isNil(agencyId) || _.isNil(routeId))
        return Promise.reject('an agency and route must be specified')

    return Promise.resolve([
        getInfo(agencyId, routeId),
        getStops(agencyId, routeId),
        getStopSequence(agencyId, routeId),
        getRuns(agencyId, routeId)
    ])
    .all()
    .spread(merge)
}