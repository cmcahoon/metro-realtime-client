const request = require('superagent');
const mock = require('superagent-mocker')(request);

module.exports = mock;
