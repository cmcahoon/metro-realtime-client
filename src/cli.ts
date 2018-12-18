#!/usr/bin/env node

import * as _ from "lodash";
import * as client from "./index";

const prettyjson = require("prettyjson");
const program = require("commander");

let prettyPrint = true;

function printJSON(obj: any) {
    const cleanedJSON = _.omitBy(obj, _.isFunction);
    if (prettyPrint) {
        console.log(prettyjson.render(cleanedJSON));
    } else {
        console.log(JSON.stringify(cleanedJSON));
    }
}

program
    .version("1.0.0")
    .option("--raw", "print raw json instead of pretty printing");

program
    .command("list-agencies")
    .description("get a list of agencies")
    .action(function() {
        client.listAgencies()
        .then((agencies) => printJSON(agencies))
        .catch((err: any) => console.error("ERROR: failed to list agencies:", err));
    });

program
    .command("get-agency <id>")
    .description("get information about a specific agency")
    .action(function(id: string) {
        client.getAgency(id)
        .then((agency) => printJSON(agency))
        .catch((err: any) => console.error("ERROR: failed to get agency:", err));
    });

program
    .command("list-routes <agency>")
    .description("get a list of routes for a specific agency")
    .action(function(agency: string) {
        client.listRoutes(agency)
        .then((routes) => printJSON(routes))
        .catch((err: any) => console.error("ERROR: failed to list routes:", err));
    });

program
    .command("get-route <agency> <id>")
    .description("get information about a specific routes")
    .action(function(agency: string, id: string) {
        client.getRoute(agency, id)
        .then((route) => printJSON(route))
        .catch((err: any) => console.error("ERROR: failed to get route:", err));
    });

program
    .command("list-stops <agency> <route>")
    .description("get a list of stops on a route")
    .action(function(agency: string, route: string) {
        client.listStops(agency, route)
        .then((stops) => printJSON(stops))
        .catch((err: any) => console.error("ERROR: failed to get stops:", err));
    });

program
    .command("get-stop <agency> <id>")
    .description("get information about a specific stop")
    .action(function(agency: string, id: string) {
        client.getStop(agency, id)
        .then((stop) => printJSON(stop))
        .catch((err: any) => console.error("ERROR: failed to get stop:", err));
    });

program
    .command("list-vehicles <agency> [route]")
    .description("get a list of vehicles for a specific agency")
    .action(function(agency: string, route: string) {
        client.listVehicles(agency, route)
        .then((vehicles) => printJSON(vehicles))
        .catch((err: any) => console.error("ERROR: failed to list vehicles:", err));
    });

program
    .parse(process.argv);

// TODO: I'm pretty sure this is a race condition
if (program.raw) {
    prettyPrint = false;
}
