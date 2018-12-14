import * as agencyModel from "./models/agency";
import * as routeModel from "./models/route";
import * as stopModel from "./models/stop";
import * as vehicleModel from "./models/vehicle";

const builder = require("fluent-interface-builder");

// TODO: The unit tests are mocking a `models` object. This should be refactored, but for now I
// want to maintain the tests.
const models = {
    agency: agencyModel,
    route: routeModel,
    stop: stopModel,
    vehicle: vehicleModel,
};

const getPath = builder.build()
    // context
    .cascade("fromAgency", (agency: string) => (context: any) => { context.agency = agency; })
    // terminators
    .unwrap("agency", (agency: string) => (context: any) => models.agency.get(agency))
    .unwrap("route", (route: string) => (context: any) => models.route.get(context.agency, route))
    .unwrap("stop", (stop: string) => (context: any) => models.stop.get(context.agency, stop))
    .value;

const listPath = builder.build()
    // context
    .cascade("fromAgency", (agency: string) => (context: any) => { context.agency = agency; })
    .cascade("onRoute", (route: string) => (context: any) => { context.route = route; })
    // terminators
    .unwrap("agencies", () => (context: any) => models.agency.list())
    .unwrap("routes", () => (context: any) => models.route.list(context.agency))
    .unwrap("stops", () => (context: any) => models.stop.list(context.agency, context.route))
    .unwrap("vehicles", () => (context: any) => models.vehicle.list(context.agency, context.route))
    .value;

const get = () => getPath({});
const list = () => listPath({});

export {
    get,
    list,
};
