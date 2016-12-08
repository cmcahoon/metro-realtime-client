'use strict'

const _ = require('lodash')
let prettyjson = require('prettyjson')
let program = require('commander')
let models = {
    agency: require('./models/agency'),
    route: require('./models/route'),
    stop: require('./models/stop'),
    vehicle: require('./models/vehicle')
}


console.json = function(json) {
    console.log(prettyjson.render(
        _.omitBy(json, _.isFunction)
    ))
}


program
    .version('1.0.0')

program
    .command('agencies')
    .description('list agencies')
    .action(function(options) {
        models.agency.list()
        .then((agency) => {
            console.json(agency)
        })
        .catch((err) => {
            console.error('ERROR: failed to list agencies:', err)
        })
    })

program
    .command('routes <agency>')
    .description('list routes for a specific agency')
    .action(function(agency, options) {
        models.agency.get(agency)
        .then((agency) => agency.routes())
        .spread((routes) => {
            console.json(routes)
        })
        .catch((err) => {
            console.error('ERROR: failed to list routes:', err)
        })
    })

program
    .command('stops <agency> <route>')
    .description('list stops for a specific route')
    .action(function(agency, route, options) {
        models.stop.list(agency, route)
        .spread((stops) => {
            console.json(stops)
        })
        .catch((err) => {
            console.error('ERROR: failed to list stops:', err)
        })
    })

program
    .command('vehicles <agency>')
    .description('list vehicles for a specific agency')
    .action(function(agency, options) {
        models.agency.get(agency)
        .then((agency) => agency.vehicles())
        .spread((vehicles) => {
            console.json(vehicles)
        })
        .catch((err) => {
            console.error('ERROR: failed to list vehicles:', err)
        })
    })

program
    .parse(process.argv)