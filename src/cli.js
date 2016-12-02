"use strict"

let prettyjson = require("prettyjson")
let program = require("commander")
let models = {
    agency: require("./models/agency"),
    route: require("./models/route"),
    stop: require("./models/stop"),
    vehicle: require("./models/vehicle")
}


program
    .version("1.0.0")

program
    .command("agencies")
    .description("list agencies")
    .action(function(options) {
        models.agency.list()
        .then((agency) => {
            console.log(prettyjson.render(agency))
        })
    })

program
    .command("routes <agency>")
    .description("list routes for a specific agency")
    .action(function(agency, options) {
        models.agency.get(agency)
        .then((agency) => agency.routes())
        .spread((routes) => {
            console.log(prettyjson.render(routes))
        })
    })

program
    .command("stops <agency> <route>")
    .description("list stops for a specific route")
    .action(function(agency, route, options) {
        models.stop.list(agency, route)
        .spread((stops) => {
            console.log(prettyjson.render(stops))
        })
    })

program
    .command("vehicles <agency>")
    .description("list vehicles for a specific agency")
    .action(function(agency, options) {
        models.vehicle.list(agency)
        .spread((vehicles) => {
            console.log(prettyjson.render(vehicles))
        })
    })

program
    .parse(process.argv)