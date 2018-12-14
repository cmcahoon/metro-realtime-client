'use strict'

let chai = require('./chai')
let vehicle = require('../../lib/models/vehicle')
let baseURL = require('../../lib/constants').baseEndpointURL


// setup mocks

let mock = require('./mock')

const response = {
    body: {
        items: [
            {
                id: "1",
                latitude: 0,
                longitude: 0,
                heading: 90,
                run_id: "1",
                route_id: "1",
                predictable: true,
                seconds_since_report: 100
            }
        ]
    }
}


// test definitions

describe('the vehicle model', function() {

    beforeEach(function() {
        mock.clearRoutes()
    })

    it('should be able to list all vehicles from an agency', function() {
        mock.get(baseURL + '/agencies/:agency/vehicles/', function() {
            // any agency can be passed in
            return response 
        })
        return vehicle.list('foo').should.eventually.deep.equal(response.body.items)
    })

    it('should return an error if you try to list vehicles without an agency', function() {
        return vehicle.list().should.eventually.be.rejectedWith('An agency must be specified.')
    })

})