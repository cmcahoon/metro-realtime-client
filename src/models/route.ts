import * as _ from "lodash";
import { baseEndpointURL } from "../constants";
import * as request from "../request";

interface IRoute {
    id: string;
    display_name: string;
}

interface IRouteInfo {
    id: string;
    display_name: string;
    fg_color: string;
    bg_color: string;
}

interface IStop {
    id: string;
    display_name: string;
    latitude: number;
    longitude: number;
}

interface IRun {
    id: string;
    display_name: string;
    display_in_ui: boolean;
    route_id: string;
    direction_name: string;
}

// TODO: This does not feel right
interface IFullRoute extends IRouteInfo {
    stops: IStop[];
    stop_sequence: IStop[];
    runs: IRun[];
}

// helpers

function getInfo(agencyId: string, routeId: string): Promise<IRouteInfo> {
    return request
        .get(baseEndpointURL + "/agencies/" + agencyId + "/routes/" + routeId + "/")
        .promise()
        .then(request.callback.onResponse)
        .catch(request.callback.onError);
}

function getStops(agencyId: string, routeId: string): Promise<IStop[]> {
    return request
        .get(baseEndpointURL + "/agencies/" + agencyId + "/routes/" + routeId + "/stops/")
        .promise()
        .then(request.callback.onResponse)
        .then((body: any) => body.items)
        .catch(request.callback.onError);
}

function getStopSequence(agencyId: string, routeId: string): Promise<IStop[]> {
    return request
        .get(baseEndpointURL + "/agencies/" + agencyId + "/routes/" + routeId + "/sequence/")
        .promise()
        .then(request.callback.onResponse)
        .then((body: any) => body.items)
        .catch(request.callback.onError);
}

function getRuns(agencyId: string, routeId: string): Promise<IRun[]> {
    return request
        .get(baseEndpointURL + "/agencies/" + agencyId + "/routes/" + routeId + "/runs/")
        .promise()
        .then(request.callback.onResponse)
        .then((body: any) => body.items)
        .catch(request.callback.onError);
}

// transformers

function merge(info: IRouteInfo, stops: IStop[], stopSequence: IStop[], runs: IRun[]): IFullRoute {
    const mergedRoute = {
        ...info,
    } as IFullRoute;
    mergedRoute.stops = stops;
    mergedRoute.stop_sequence = stopSequence;
    mergedRoute.runs = runs;

    return mergedRoute;
}

// exports

async function get(agencyId: string, routeId: string): Promise<IFullRoute> {
    if (_.isNil(agencyId) || _.isNil(routeId)) {
        throw new Error("An agency and route must be specified.");
    }

    const results = await Promise.all([
        getInfo(agencyId, routeId),
        getStops(agencyId, routeId),
        getStopSequence(agencyId, routeId),
        getRuns(agencyId, routeId),
    ]);
    return merge(...results);
}

function list(agencyId: string): Promise<IRoute[]> {
    if (_.isNil(agencyId)) {
        return Promise.reject("An agency must be specified.");
    }

    return request
        .get(baseEndpointURL + "/agencies/" + agencyId + "/routes/")
        .promise()
        .then(request.callback.onResponse)
        .then(_.partial(_.get, _, "items"))
        .catch(request.callback.onError);
}

export {
    IRoute,
    get,
    list,
};
