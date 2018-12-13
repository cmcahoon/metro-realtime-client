'use strict'

let chai = require('./chai')
let agency = require('../../lib/models/agency')
let baseURL = require('../../lib/constants').baseEndpointURL


// setup mocks

let mock = require('./mock')

const response = {
    body: [
        {
            id: 'test_agency',
            display_name: 'Test Agency'
        },
        {
            id: 'another_test_agency',
            display_name: 'Another Test Agency'
        }
    ]
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
        return agency.get(response.body[1].id).should.eventually.equal(response.body[1])
    })

    it('should return an error if you try to get an agency that does not exist', function() {
        mock.get(baseURL + '/agencies/', function() { return response })
        return agency.get('does-not-exist').should.eventually.be.rejectedWith('Agency not found')
    })

})