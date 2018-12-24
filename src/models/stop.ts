import * as _ from "lodash";
import { baseEndpointURL } from "../constants";
import { request } from "../request";
import { IRoute } from "./route";

interface IStop {
    id: string;
    display_name: string;
}

interface IStopWithLocation extends IStop {
    latitude: number;
    longitude: number;
}

interface IPrediction {
    route_id: string;
    run_id: string;
    block_id: string;
    minutes: number;
    seconds: number;
    is_departing: boolean;
}

// TODO: This does not feel right
interface IFullStop extends IStop {
    routes: IRoute[];
    predictions: IPrediction[];
}

// helpers

function getInfo(agencyId: string, stopId: string): Promise<IStop> {
    return request
        .get(baseEndpointURL + "/agencies/" + agencyId + "/stops/" + stopId + "/info/")
        .promise()
        .then(request.callback.onResponse)
        .catch(request.callback.onError);
}

function getRoutes(agencyId: string, stopId: string): Promise<IRoute[]> {
    return request
        .get(baseEndpointURL + "/agencies/" + agencyId + "/stops/" + stopId + "/routes/")
        .promise()
        .then(request.callback.onResponse)
        .then((body: any) => body.items)
        .catch(request.callback.onError);
}

// function getMessages(agencyId: string, stopId: string) {
//     return request
//         .get(baseEndpointURL + "/agencies/" + agencyId + "/stops/" + stopId + "/messages/")
//         .promise()
//         .then(request.callback.onResponse)
//         .catch(request.callback.onError)
// }

function getPredictions(agencyId: string, stopId: string): Promise<IPrediction[]> {
    return request
        .get(baseEndpointURL + "/agencies/" + agencyId + "/stops/" + stopId + "/predictions/")
        .promise()
        .then(request.callback.onResponse)
        .then((body: any) => body.items)
        .catch(request.callback.onError);
}

// transformers

function merge(info: IStop, routes: IRoute[], predictions: IPrediction[]): IFullStop {
    const mergedStop = {
        ...info,
    } as IFullStop;
    mergedStop.routes = routes;
    mergedStop.predictions = predictions;

    return mergedStop;
}

// exports

async function get(agencyId: string, stopId: string): Promise<IFullStop> {
    if (_.isNil(agencyId) || _.isNil(stopId)) {
        return Promise.reject("An agency and stop must be specified.");
    }

    const results = await Promise.all([
        getInfo(agencyId, stopId),
        getRoutes(agencyId, stopId),
        getPredictions(agencyId, stopId),
    ]);
    return merge(...results);
}

function list(agencyId: string, routeId: string): Promise<IStopWithLocation[]> {
    if (_.isNil(agencyId) || _.isNil(routeId)) {
        return Promise.reject("An agency and route must be specified.");
    }

    return request
        .get(baseEndpointURL + "/agencies/" + agencyId + "/routes/" + routeId + "/stops/")
        .promise()
        .then(request.callback.onResponse)
        .then(_.partial(_.get, _, "items"))
        .catch(request.callback.onError);
}

export {
    IFullStop,
    IStopWithLocation,
    get,
    list,
};
