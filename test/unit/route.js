'use strict'

const _ = require('lodash')
let chai = require('./chai')
let route = require('../../src/models/route')
let baseURL = require('../../src/constants.js').baseEndpointURL

// setup mocks

let mock = require('./mock')

const listResponse = {
    body: {
        items: [
            {
                display_name: 'test route alpha',
                id: '1'
            },
            {
                display_name: 'test route beta',
                id: '2'
            }
        ]
    }
}

const getInfoResponse = {
    body: {
        bg_color: "#990000",
        display_name: "test route alpha",
        id: "1",
        fg_color: "#ffffff"
    }
}

const getStopsResponse = {
    body: {
        items: [
            {
                latitude: 0,
                longitude: 0,
                display_name: 'station one',
                id: 'station_1'
            },
            {
                latitude: 1,
                longitude: 1,
                display_name: 'station two',
                id: 'station_2'
            }
        ]
    }
}

const getRunsResponse = {
    body: {
        items: [
            {
                route_id: "1",
                display_in_ui: true,
                display_name: "north",
                id: 'run_1',
                direction_name: "north"
            }
        ]
    }
}

const fullGetResponse = _.chain(getInfoResponse.body)
    .clone()
    .set('stops', getStopsResponse.body.items)
    .set('stop_sequence', getStopsResponse.body.items)
    .set('runs', getRunsResponse.body.items)
    .value()


// test definitions

describe('the route model', function() {

    beforeEach(function() {
        mock.clearRoutes()
    })

    it('should be able to list routes', function() {
        mock.get(baseURL + '/agencies/:agency/routes/', function(req) {
            // ignoring parameters -- any agency can be passed
            return listResponse 
        })
        return route.list('foo').should.eventually.deep.equal(listResponse.body.items)
    })

    it('should return an error if you try to list routes without specifying an agency', function() {
        return route.list().should.eventually.be.rejectedWith('an agency must be specified')
    })

    it('should be able to get a specific route by id', function() {
        mock.get(baseURL + '/agencies/:agency/routes/:route/', function(req) {
            // ignoring parameters -- any agency or route can be passed
            return getInfoResponse
        })
        mock.get(baseURL + '/agencies/:agency/routes/:route/:resource/', function(req) {
            // ignoring parameters -- any agency or route can be passed
            switch (req.params.resource) {
                case 'stops': return getStopsResponse
                case 'sequence': return getStopsResponse
                case 'runs': return getRunsResponse
                default: return null
            }
        })
        return route.get('foo', 'bar').should.eventually.deep.equal(fullGetResponse)
    })

    it('should return an error if you try to get a route without specifying an agency and route', function() {
        return route.get().should.eventually.be.rejectedWith('an agency and route must be specified')
    })

})