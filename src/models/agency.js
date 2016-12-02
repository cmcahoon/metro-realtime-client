"use strict"

let request = require("../request")
let baseURL = require("../constants").baseEndpointURL


exports.list = function() {
    return request
        .get(baseURL + "/agencies/")
        .promise()
        .then(request.callback.onResponse)
        .catch(request.callback.onError)
}
