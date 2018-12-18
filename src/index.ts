import * as agency from "./models/agency";
import * as route from "./models/route";
import * as stop from "./models/stop";
import * as vehicle from "./models/vehicle";

const getAgency = agency.get;
const getRoute = route.get;
const getStop = stop.get;
const listAgencies = agency.list;
const listRoutes = route.list;
const listStops = stop.list;
const listVehicles = vehicle.list;

export {
    getAgency,
    getRoute,
    getStop,
    listAgencies,
    listRoutes,
    listStops,
    listVehicles,
};
