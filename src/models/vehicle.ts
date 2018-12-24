import * as _ from "lodash";
import { baseEndpointURL } from "../constants";
import { request } from "../request";

interface IVehicle {
    id: string;
    route_id: string;
    run_id: string;
    latitude: number;
    longitude: number;
    heading: number;
    predictable: boolean;
    seconds_since_report: number;
}

function list(agency: string, route?: string): Promise<IVehicle[]> {
    if (_.isNil(agency)) {
        return Promise.reject("An agency must be specified.");
    }

    const url = _.isNil(route) ?
        baseEndpointURL + "/agencies/" + agency + "/vehicles/" :
        baseEndpointURL + "/agencies/" + agency + "/routes/" + route + "/vehicles/";

    return request
        .get(url)
        .promise()
        .then(request.callback.onResponse)
        .then(_.partial(_.get, _, "items"))
        .catch(request.callback.onError);
}

export {
    IVehicle,
    list,
};
