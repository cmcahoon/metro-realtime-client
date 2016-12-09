'use strict'

let chai = require('chai')
let chaiAsPromised = require('chai-as-promised')

// initialize chai

chai.use(chaiAsPromised)
chai.should()


module.exports = chai