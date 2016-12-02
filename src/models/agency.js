"use strict"

const baseURL = require("../constants").baseEndpointURL
let request = require("../request")
let models = {
    agency: require("./agency"),
    route: require("./route"),
    stop: require("./stop"),
    vehicle: require("./vehicle")
}


class Agency {

    constructor(id, name) {
        this.id = id
        this.name = name
    }

    routes() {
        return models.route.list(this.id)
    }

}
 

function toAgency(obj) {
    return new Agency(obj.id, obj.display_name)
}


exports.list = function() {
    return request
        .get(baseURL + "/agencies/")
        .promise()
        .then(request.callback.onResponse)
        .spread(toAgency)
        .catch(request.callback.onError)
}


exports.get = function(id) {
    // the API only returns a single agency, so we are going to do a 
    // sanity check on the id
    return exports.list()
    .then((agency) => {
        if (agency.id != id) 
            return Promise.reject("requested agency does not exist")
        return Promise.resolve(agency)
    })
}
