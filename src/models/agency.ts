import * as _ from "lodash";
import { baseEndpointURL } from "../constants";
import * as request from "../request";

interface IAgency {
    id: string;
    display_name: string;
}

async function get(id: string): Promise<IAgency> {
    const agencies = await list();

    const agency = _.find(agencies, (a) => a.id === id );
    if (agency === undefined) {
        throw new Error("Agency not found.");
    }
    return agency;
}

function list(): Promise<IAgency[]> {
    return request
        .get(baseEndpointURL + "/agencies/")
        .promise()
        .then(request.callback.onResponse)
        .catch(request.callback.onError);
}

export {
    get,
    list,
};
