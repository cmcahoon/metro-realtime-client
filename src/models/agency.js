'use strict'

const _ = require('lodash')
const baseURL = require('../constants').baseEndpointURL
let request = require('../request')
let models = {
    route: require('./route'),
    vehicle: require('./vehicle')
}


function extend(agency) {
    return _(agency)
        .set('routes', models.route.list)
        .set('vehicles', _.bind(models.vehicle.list, null, agency.id))
        .value()
}


exports.list = function() {
    return request
        .get(baseURL + '/agencies/')
        .promise()
        .then(request.callback.onResponse)
        .spread(extend)
        .catch(request.callback.onError)
}


exports.get = function(id) {
    // the API only returns a single agency, so we are going to do a 
    // sanity check on the id
    return exports.list()
    .then((agency) => {
        if (agency.id != id) 
            return Promise.reject('requested agency does not exist')
        return Promise.resolve(agency)
    })
}
