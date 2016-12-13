#!/usr/bin/env node

'use strict'

const _ = require('lodash')
let prettyjson = require('prettyjson')
let program = require('commander')
let client = require('./index')
let models = {
    agency: require('./models/agency'),
    route: require('./models/route'),
    stop: require('./models/stop'),
    vehicle: require('./models/vehicle')
}


let prettyPrint = true

console.json = function(json) {
    let cleanedJSON = _.omitBy(json, _.isFunction)
    if (prettyPrint) {
        console.log(prettyjson.render(cleanedJSON))
    }
    else {
        console.log(JSON.stringify(cleanedJSON))
    }
}


program
    .version('1.0.0')
    .option('--raw', 'print raw json instead of pretty printing')

program
    .command('list-agencies')
    .description('get a list of agencies')
    .action(function(options) {
        client.list().agencies()
        .then((agency) => console.json(agency))
        .catch((err) => console.error('ERROR: failed to list agencies:', err))
    })

program
    .command('get-agency <id>')
    .description('get information about a specific agency')
    .action(function(id, options) {
        client.get().agency(id)
        .then((agency) => console.json(agency))
        .catch((err) => console.error('ERROR: failed to get agency:', err))
    })

program
    .command('list-routes <agency>')
    .description('get a list of routes for a specific agency')
    .action(function(agency, options) {
        client.list().fromAgency(agency).routes()
        .then((routes) => console.json(routes))
        .catch((err) => console.error('ERROR: failed to list routes:', err))
    })

program
    .command('get-route <agency> <id>')
    .description('get information about a specific routes')
    .action(function(agency, id, options) {
        client.get().fromAgency(agency).route(id)
        .then((route) => console.json(route))
        .catch((err) => console.error('ERROR: failed to get route:', err))
    })

program
    .command('list-stops <agency> <route>')
    .description('get a list of stops on a route')
    .action(function(agency, route, options) {
        client.list().fromAgency(agency).onRoute(route).stops()
        .then((stops) => console.json(stops))
        .catch((err) => console.error('ERROR: failed to get stops:', err))
    })

program
    .command('get-stop <agency> <id>')
    .description('get information about a specific stop')
    .action(function(agency, id, options) {
        client.get().fromAgency(agency).stop(id)
        .then((stop) => console.json(stop))
        .catch((err) => console.error('ERROR: failed to get stop:', err))
    })

program
    .command('list-vehicles <agency> [route]')
    .description('get a list of vehicles for a specific agency')
    .action(function(agency, route, options) {
        client.list().fromAgency(agency).onRoute(route).vehicles()
        .then((vehicles) => console.json(vehicles))
        .catch((err) => console.error('ERROR: failed to list vehicles:', err))
    })

program
    .parse(process.argv)


// TODO: i'm pretty sure this is a race condition
if (program.raw) prettyPrint = false
