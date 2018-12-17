import * as _ from "lodash";
import { baseEndpointURL } from "../../src/constants";
import * as routeModel from "../../src/models/route";

const mock = require("./mock");

const mockListResponse = {
    body: {
        items: [
            {
                display_name: "test route alpha",
                id: "1",
            },
            {
                display_name: "test route beta",
                id: "2",
            },
        ],
    },
};

const mockGetInfoResponse = {
    body: {
        bg_color: "#990000",
        display_name: "test route alpha",
        fg_color: "#ffffff",
        id: "1",
    },
};

const mockGetStopsResponse = {
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

const mockGetRunsResponse = {
    body: {
        items: [
            {
                direction_name: "north",
                display_in_ui: true,
                display_name: "north",
                id: "run_1",
                route_id: "1",
            },
        ],
    },
};

const fullGetResponse = _.chain(mockGetInfoResponse.body)
    .clone()
    .set("stops", mockGetStopsResponse.body.items)
    .set("stop_sequence", mockGetStopsResponse.body.items)
    .set("runs", mockGetRunsResponse.body.items)
    .value();

describe("The route model", () => {

    beforeEach(() => {
        mock.clearRoutes();
    });

    it("should be able to list routes", async () => {
        mock.get(baseEndpointURL + "/agencies/:agency/routes/", () => mockListResponse);
        await expect(routeModel.list("foo")).resolves.toEqual(mockListResponse.body.items);
    });

    it("should return an error if you try to list routes without specifying an agency", async () => {
        // @ts-ignore
        return expect(routeModel.list()).rejects.toBe("An agency must be specified.");
    });

    it("should be able to get a specific route by id", async () => {
        mock.get(baseEndpointURL + "/agencies/:agency/routes/:route/", () => mockGetInfoResponse);
        mock.get(baseEndpointURL + "/agencies/:agency/routes/:route/:resource/", (req: any) => {
            // ignoring parameters -- any agency or route can be passed
            switch (req.params.resource) {
                case "stops": return mockGetStopsResponse;
                case "sequence": return mockGetStopsResponse;
                case "runs": return mockGetRunsResponse;
                default: return null;
            }
        });
        await expect(routeModel.get("foo", "bar")).resolves.toEqual(fullGetResponse);
    });

    it("should return an error if you try to get a route without specifying an agency and route", async () => {
        // @ts-ignore
        await expect(routeModel.get()).rejects.toThrow("An agency and route must be specified.");
    });

});
