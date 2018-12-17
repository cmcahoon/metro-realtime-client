const rewire = require("rewire");

// TODO: These shouldn't be brought in from the `lib` directory.
const models = {
    agency: require("../../lib/models/agency"),
    route: require("../../lib/models/route"),
    stop: require("../../lib/models/stop"),
    vehicle: require("../../lib/models/vehicle"),
};

const client = rewire("../../lib/index");

describe("The realtime client", function() {

    beforeEach(() => {
        this.rewireModels = (stubsAndMocks: any) => {
            this._revert = client.__set__("models", models);
            this._stubsAndMocks = stubsAndMocks ? stubsAndMocks : [];
        };
    });

    afterEach(() => {
        if (this._revert) {
            this._revert();
        }

        for (const o of this._stubsAndMocks) {
            o.restore();
        }
    });

    it("can list agencies", async () => {
        const spy = jest.spyOn(models.agency, "list").mockResolvedValue(null);
        this.rewireModels();

        await client.list().agencies();
        expect(spy).toHaveBeenCalledTimes(1);

        spy.mockRestore();
    });

    it("can list routes for a specific agency", async () => {
        const spy = jest.spyOn(models.route, "list").mockResolvedValue(null);
        this.rewireModels();

        await client.list().fromAgency("foo").routes();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith("foo");

        spy.mockRestore();
    });

    it("should return an error when requesting routes with specifying an agency", async () => {
        await expect(client.list().routes()).rejects.toBe("An agency must be specified.");
    });

    it("can list stops for a specific route", async () => {
        const spy = jest.spyOn(models.stop, "list").mockResolvedValue(null);
        this.rewireModels();

        await client.list().fromAgency("foo").onRoute("bar").stops();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith("foo", "bar");

        spy.mockRestore();
    });

    it("should return an error when requesting stops without specifying an agency and route", async () => {
        await expect(client.list().stops()).rejects.toBe("An agency and route must be specified.");
        await expect(client.list().fromAgency("foo").stops()).rejects.toBe("An agency and route must be specified.");
    });

    it("can list vehicles for a specific agency", async () => {
        const spy = jest.spyOn(models.vehicle, "list").mockResolvedValue(null);
        this.rewireModels();

        await client.list().fromAgency("foo").onRoute("bar").vehicles();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith("foo", "bar");
    });

    it("should return an error when requesting vehicles without specifying an agency", async () => {
        await expect(client.list().vehicles()).rejects.toBe("An agency must be specified.");
    });

    it("can get a specific agency", async () => {
        const spy = jest.spyOn(models.agency, "get").mockResolvedValue(null);
        this.rewireModels();

        await client.get().agency("foo");
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith("foo");
    });

    it("should return an error when requesting an agency without specifying an agency", async () => {
        await expect(client.get().agency("foo")).rejects.toThrowError();
    });

    it("can get a specific route", async () => {
        const spy = jest.spyOn(models.route, "get").mockResolvedValue(null);
        this.rewireModels();

        await client.get().fromAgency("foo").route("bar");
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith("foo", "bar");
    });

    it("should return an error when requesting a route without specifying an agency and route", async () => {
        await expect(client.get().route()).rejects.toBeDefined();
        await expect(client.get().route("foo")).rejects.toBeDefined();
        await expect(client.get().fromAgency("foo").route()).rejects.toBeDefined();
    });

    it("can get a specific stop", async () => {
        const spy = jest.spyOn(models.stop, "get").mockResolvedValue(null);
        this.rewireModels();

        await client.get().fromAgency("foo").stop("bar");
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith("foo", "bar");
    });

    it("should return an error when requesting a stop without specifying an agency and stop", async () => {
        await expect(client.get().stop()).rejects.toBeDefined();
        await expect(client.get().stop("foo")).rejects.toBeDefined();
        await expect(client.get().fromAgency("foo").stop()).rejects.toBeDefined();
    });

});
