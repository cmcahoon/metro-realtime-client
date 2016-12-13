'use strict'

const Promise = require('bluebird')
let chai = require('./chai')
let rewire = require('rewire')
let sinon = require('sinon')


// use 'rewire' to help with mocking

let client = rewire('../../src/index')


// setup mocks

let models = {
    agency: require('../../src/models/agency'),
    route: require('../../src/models/route'),
    stop: require('../../src/models/stop'),
    vehicle: require('../../src/models/vehicle')
}


// test definitions

describe('the realtime client', function() {

    beforeEach(function() {
        this.rewireModels = (stubsAndMocks) => {
            this._revert = client.__set__('models', models)
            this._stubsAndMocks = stubsAndMocks ? stubsAndMocks : []
        }
    })

    afterEach(function() {
        if (this._revert) this._revert()
        
        for (let o of this._stubsAndMocks) {
            o.restore()
        }
    })

    it('can list agencies', function() {
        let spy = sinon.spy(models.agency, 'list')
        this.rewireModels()

        client.list().agencies()
        spy.calledOnce.should.be.true
    })

    it('can list routes for a specific agency', function() {
        let stub = sinon.stub(models.route, 'list')
        stub.returns(null)
        this.rewireModels([ stub ])

        client.list().fromAgency('foo').routes()
        stub.calledOnce.should.be.true
        stub.calledWith('foo').should.be.true
    })

    it('should return an error when requesting routes with specifying an agency', function() {
        return client.list().routes().should.be.rejected
    })

    it('can list stops for a specific route', function() {
        let stub = sinon.stub(models.stop, 'list')
        stub.returns(null)
        this.rewireModels([ stub ])

        client.list().fromAgency('foo').onRoute('bar').stops()
        stub.calledOnce.should.be.true
        stub.calledWith('foo', 'bar').should.be.true
    })

    it('should return an error when requesting stops without specifying an agency and route', function() {
        return Promise.all([
            client.list().stops().should.be.rejected,
            client.list().fromAgency('foo').stops().should.be.rejected
        ])
    })

    it('can list vehicles for a specific agency', function() {
        let stub = sinon.stub(models.vehicle, 'list')
        stub.returns(null)
        this.rewireModels([ stub ])

        client.list().fromAgency('foo').onRoute('bar').vehicles()
        stub.calledOnce.should.be.true
        stub.calledWith('foo', 'bar').should.be.true
    })

    it('should return an error when requesting vehicles without specifying an agency', function() {
        return client.list().vehicles().should.be.rejected
    })

    it('can get a specific agency', function() {
        let stub = sinon.stub(models.agency, 'get')
        stub.returns(null)
        this.rewireModels([ stub ])

        client.get().agency('foo')
        stub.calledOnce.should.be.true
        stub.calledWith('foo').should.be.true
    })

    it('should return an error when requesting an agency without specifying an agency', function() {
        return client.get().agency('foo').should.be.rejected
    })

    it('can get a specific route', function() {
        let stub = sinon.stub(models.route, 'get')
        stub.returns(null)
        this.rewireModels([ stub ])

        client.get().fromAgency('foo').route('bar')
        stub.calledOnce.should.be.true
        stub.calledWith('foo', 'bar').should.be.true
    })

    it('should return an error when requesting a route without specifying an agency and route', function() {
        return Promise.all([
            client.get().route().should.be.rejected,
            client.get().route('foo').should.be.rejected,
            client.get().fromAgency('foo').route().should.be.rejected
        ])
    })

    it('can get a specific stop', function() {
        let stub = sinon.stub(models.stop, 'get')
        stub.returns(null)
        this.rewireModels([ stub ])

        client.get().fromAgency('foo').stop('bar')
        stub.calledOnce.should.be.true
        stub.calledWith('foo', 'bar').should.be.true
    })

    it('should return an error when requesting a stop without specifying an agency and stop', function() {
        return Promise.all([
            client.get().stop().should.be.rejected,
            client.get().stop('foo').should.be.rejected,
            client.get().fromAgency('foo').stop().should.be.rejected
        ])
    })

})