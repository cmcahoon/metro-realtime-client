'use strict'

const Promise = require('./promise')
let builder = require('fluent-interface-builder')
let models = {
    agency: require('./models/agency'),
    route: require('./models/route'),
    stop: require('./models/stop'),
    vehicle: require('./models/vehicle')
}


let listPath = builder.build()
    // context
    .cascade('fromAgency', (agency) => (context) => { context.agency = agency })
    .cascade('onRoute', (route) => (context) => { context.route = route })
    // terminators
    .unwrap('agencies', () => (context) => models.agency.list())
    .unwrap('routes', () => (context) => {
        if (!context.agency) return Promise.reject('an agency must be provided')
        return models.route.list(context.agency)
    })
    .unwrap('stops', () => (context) => {
        if (!context.agency || !context.route) return Promise.reject('an agency and route must be provided')
        return models.stop.list(context.agency, context.route)
    })
    .unwrap('vehicles', () => (context) => models.vehicle.list())
    .value


let getPath = builder.build()
    // context
    .cascade('fromAgency', (agency) => (context) => { context.agency = agency })
    // terminators
    .unwrap('agency', (agency) => (context) => models.agency.get(agency))
    .unwrap('route', (route) => (context) => {
        if (!context.agency) return Promise.reject('an agency must be provided')
        return models.route.get(context.agency, route)
    })
    .unwrap('stop', (stop) => (context) => {
        if (!context.agency) return Promise.reject('an agency must be provided')
        return models.stop.get(context.agency, stop)
    })
    .value


module.exports = {
    list: () => listPath({}),
    get: () => getPath({})
}