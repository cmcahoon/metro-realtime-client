let request = require("superagent-bluebird-promise");

function onResponse(res: any) {
    return Promise.resolve(res.body);
}

function onError(err: any) {
    /**
     * All errors have the 'error' key. 400 and 500 errors also have 
     * a 'status' and 'res' key.
     */
    return Promise.reject({
        message: err.error,
        response: err.res,
        status: err.status,
    });
}

request = Object.assign(request, {
    callback: {
        onError,
        onResponse,
    },
});

export {
    request,
};
