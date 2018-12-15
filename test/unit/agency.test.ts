import { baseEndpointURL } from "../../src/constants";
import * as agencyModel from "../../src/models/agency";

const mock = require("./mock");
const response = {
    body: [
        {
            display_name: "Test Agency",
            id: "test_agency",

        },
        {
            display_name: "Another Test Agency",
            id: "another_test_agency",
        },
    ],
};

describe("The agency model", () => {

    beforeEach(() => {
        mock.clearRoutes();
    });

    it("should be able to list agencies", () => {
        mock.get(baseEndpointURL + "/agencies/", () => response);
        return agencyModel.list().then((agencies) => {
            expect(agencies).toEqual(response.body);
        });
    });

    it("should be able to get a specific agency by id", () => {
        mock.get(baseEndpointURL + "/agencies/", () => response);
        return agencyModel.get(response.body[1].id).then((agency) => {
            expect(agency).toEqual(response.body[1]);
        });
    });

    it("should return an error if you try to get an agency that does not exist", async () => {
        mock.get(baseEndpointURL + "/agencies/", () => response);
        await expect(agencyModel.get("does-not-exist")).rejects.toThrow("Agency not found");
    });

});
