'use strict'

let request = require('superagent')
let mock = require('superagent-mocker')(request)


module.exports = mock