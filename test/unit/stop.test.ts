import * as _ from "lodash";
import { baseEndpointURL } from "../../src/constants";
import * as stopModel from "../../src/models/stop";

const mock = require("./mock");
const mockListResponse = {
    body: {
        items: [
            {
                display_name: "station one",
                id: "station_1",
                latitude: 0,
                longitude: 0,
            },
            {
                display_name: "station two",
                id: "station_2",
                latitude: 1,
                longitude: 1,
            },
        ],
    },
};

const mockGetInfoResponse = {
    body: {
        display_name: "stop one",
        id: "1",
    },
};

const mockGetRoutesResponse = {
    body: {
        items: [
            {
                display_name: "route one",
                id: "1",
            },
            {
                display_name: "route two",
                id: "2",
            },
        ],
    },
};

// const getMessagesResponse = {
//     body: {
//         items: []
//     }
// }

const mockGetPredictionsResponse = {
    body: {
        items: [
            {
                block_id: "1",
                is_departing: false,
                minutes: 0,
                route_id: "1",
                run_id: "1",
                seconds: 10,
            },
        ],
    },
};

const fullGetResponse = _.chain(mockGetInfoResponse.body)
    .clone()
    .set("routes", mockGetRoutesResponse.body.items)
    // .set("messages", getMessagesResponse.body.items)
    .set("predictions", mockGetPredictionsResponse.body.items)
    .value();

describe("The stop model", () => {

    beforeEach(() => {
        mock.clearRoutes();
    });

    it("should be able to list stops", async () => {
        mock.get(baseEndpointURL + "/agencies/:agency/routes/:route/stops/", () => mockListResponse);
        await expect(stopModel.list("foo", "bar")).resolves.toEqual(mockListResponse.body.items);
    });

    it("should return an error if you try to list stops without specifying an agency", async () => {
        // @ts-ignore
        await expect(stopModel.list()).rejects.toBe("An agency and route must be specified.");
    });

    it("should be able to get a specific stop by id", async () => {
        mock.get(baseEndpointURL + "/agencies/:agency/stops/:stop/:resource/", (req: any) => {
            // ignoring parameters -- any agency or stop can be passed
            switch (req.params.resource) {
                case "info": return mockGetInfoResponse;
                case "routes": return mockGetRoutesResponse;
                // case "messages": return getMessagesResponse
                case "predictions": return mockGetPredictionsResponse;
                default: return { body: { items: [] } };
            }
        });
        await expect(stopModel.get("foo", "bar")).resolves.toEqual(fullGetResponse);
    });

    it("should return an error if you try to get a stop without specifying an agency and stop", async () => {
        // @ts-ignore
        await expect(stopModel.get()).rejects.toBe("An agency and stop must be specified.");
    });

});