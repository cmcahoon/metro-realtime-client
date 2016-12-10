'use strict'

let chai = require('./chai')
let agency = require('../../src/models/agency')
let baseURL = require('../../src/constants').baseEndpointURL

// setup mocks

let mock = require('./mock')

const response = {
    body: {
        id: 'test_agency',
        display_name: 'Test Agency'
    }
}


// test definitions

describe('the agency model', function() {

    beforeEach(function() {
        mock.clearRoutes()
    })
    
    it('should be able to list agencies', function() {
        mock.get(baseURL + '/agencies/', function() { return response })
        return agency.list().should.eventually.equal(response.body)
    })

    it('should be able to get a specific agency by id', function() {
        mock.get(baseURL + '/agencies/', function() { return response })
        return agency.get(response.body.id).should.eventually.equal(response.body)
    })

    it('should return an error if you try to get an agency that does not exist', function() {
        mock.get(baseURL + '/agencies/', function() { return response })
        return agency.get('does-not-exist').should.eventually.be.rejectedWith('requested agency does not exist')
    })

})