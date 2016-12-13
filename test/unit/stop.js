'use strict'

const _ = require('lodash')
let chai = require('./chai')
let stop = require('../../lib/models/stop')
let baseURL = require('../../lib/constants').baseEndpointURL

// setup mocks

let mock = require('./mock')

const listResponse = {
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

const getInfoResponse = {
    body: {
        display_name: 'stop one',
        id: '1'
    }
}

const getRoutesResponse = {
    body: {
        items: [
            {
                display_name: 'route one',
                id: '1'
            },
            {
                display_name: 'route two',
                id: '2'
            }
        ]
    }
}

const getMessagesResponse = {
    body: {
        items: []
    }
}

const getPredictionsResponse = {
    body: {
        items: [
            {
                block_id: "1",
                run_id: "1",
                seconds: 10,
                is_departing: false,
                route_id: "1",
                minutes: 0
            }
        ]
    }
}

const fullGetResponse = _.chain(getInfoResponse.body)
    .clone()
    .set('routes', getRoutesResponse.body.items)
    .set('messages', getMessagesResponse.body.items)
    .set('predictions', getPredictionsResponse.body.items)
    .value()


// test definitions

describe('the stop model', function() {

    beforeEach(function() {
        mock.clearRoutes()
    })

    it('should be able to list stops', function() {
        mock.get(baseURL + '/agencies/:agency/routes/:route/stops/', function(req) {
            // ignoring parameters -- any agency and route can be passed
            return listResponse
        })
        return stop.list('foo', 'bar').should.eventually.deep.equal(listResponse.body.items)
    })

    it('should return an error if you try to list stops without specifying an agency', function() {
        return stop.list().should.eventually.be.rejectedWith('an agency and route must be specified')
    })

    it('should be able to get a specific stop by id', function() {
        mock.get(baseURL + '/agencies/:agency/stops/:stop/:resource/', function(req) {
            // ignoring parameters -- any agency or stop can be passed
            switch (req.params.resource) {
                case 'info': return getInfoResponse
                case 'routes': return getRoutesResponse
                case 'messages': return getMessagesResponse
                case 'predictions': return getPredictionsResponse
                default: return { body: { items: [] } }
            }
        })
        return stop.get('foo', 'bar').should.eventually.deep.equal(fullGetResponse)
    })

    it('should return an error if you try to get a stop without specifying an agency and stop', function() {
        return stop.get().should.eventually.be.rejectedWith('an agency and stop must be specified')
    })

})