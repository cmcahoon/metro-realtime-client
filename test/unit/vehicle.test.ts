import { baseEndpointURL } from "../../src/constants";
import * as vehicleModel from "../../src/models/vehicle";

const mock = require("./mock");
const mockResponse = {
    body: {
        items: [
            {
                heading: 90,
                id: "1",
                latitude: 0,
                longitude: 0,
                predictable: true,
                route_id: "1",
                run_id: "1",
                seconds_since_report: 100,
            },
        ],
    },
};

describe("The vehicle model", () => {

    beforeEach(() => {
        mock.clearRoutes();
    });

    it("should be able to list all vehicles from an agency", () => {
        mock.get(baseEndpointURL + "/agencies/:agency/vehicles/", () => mockResponse);
        return vehicleModel.list("foo").then((vehicles) => {
            expect(vehicles).toEqual(mockResponse.body.items);
        });
    });

    it("should return an error if you try to list vehicles without an agency", async () => {
        // @ts-ignore
        await expect(vehicleModel.list()).rejects.toBe("An agency must be specified.");
    });

});
