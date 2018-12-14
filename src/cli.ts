#!/usr/bin/env node

import * as _ from "lodash";

const prettyjson = require("prettyjson");
const program = require("commander");
const client = require("./index");
const models = {
    agency: require("./models/agency"),
    route: require("./models/route"),
    stop: require("./models/stop"),
    vehicle: require("./models/vehicle"),
};

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
    .option("--raw", "print raw json instead of pretty printing")

program
    .command("list-agencies")
    .description("get a list of agencies")
    .action(function() {
        client.list().agencies()
        .then((agency: string) => printJSON(agency))
        .catch((err: any) => console.error("ERROR: failed to list agencies:", err));
    });

program
    .command("get-agency <id>")
    .description("get information about a specific agency")
    .action(function(id: string) {
        client.get().agency(id)
        .then((agency: string) => printJSON(agency))
        .catch((err: any) => console.error("ERROR: failed to get agency:", err));
    });

program
    .command("list-routes <agency>")
    .description("get a list of routes for a specific agency")
    .action(function(agency: string) {
        client.list().fromAgency(agency).routes()
        .then((routes: string) => printJSON(routes))
        .catch((err: any) => console.error("ERROR: failed to list routes:", err));
    });

program
    .command("get-route <agency> <id>")
    .description("get information about a specific routes")
    .action(function(agency: string, id: string) {
        client.get().fromAgency(agency).route(id)
        .then((route: string) => printJSON(route))
        .catch((err: any) => console.error("ERROR: failed to get route:", err));
    });

program
    .command("list-stops <agency> <route>")
    .description("get a list of stops on a route")
    .action(function(agency: string, route: string) {
        client.list().fromAgency(agency).onRoute(route).stops()
        .then((stops: string) => printJSON(stops))
        .catch((err: any) => console.error("ERROR: failed to get stops:", err));
    });

program
    .command("get-stop <agency> <id>")
    .description("get information about a specific stop")
    .action(function(agency: string, id: string) {
        client.get().fromAgency(agency).stop(id)
        .then((stop: string) => printJSON(stop))
        .catch((err: any) => console.error("ERROR: failed to get stop:", err));
    });

program
    .command("list-vehicles <agency> [route]")
    .description("get a list of vehicles for a specific agency")
    .action(function(agency: string, route: string) {
        client.list().fromAgency(agency).onRoute(route).vehicles()
        .then((vehicles: string) => printJSON(vehicles))
        .catch((err: any) => console.error("ERROR: failed to list vehicles:", err));
    });

program
    .parse(process.argv);

// TODO: I'm pretty sure this is a race condition
if (program.raw) {
    prettyPrint = false;
}
