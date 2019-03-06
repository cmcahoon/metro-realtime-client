# metro-realtime-client

[![Build Status](https://dev.azure.com/me0571/LA%20Metro/_apis/build/status/cmcahoon.metro-realtime-client?branchName=master)](https://dev.azure.com/me0571/LA%20Metro/_build/latest?definitionId=1&branchName=master)
&nbsp;
[![Build Status](https://travis-ci.org/cmcahoon/metro-realtime-client.svg?branch=master)](https://travis-ci.org/cmcahoon/metro-realtime-client)
&nbsp;
[![Test Coverage](https://api.codeclimate.com/v1/badges/5ef9410707997a2b27de/test_coverage)](https://codeclimate.com/github/cmcahoon/metro-realtime-client/test_coverage)

Los Angeles Metro provides a RESTful API to retrieve realtime positions of their
bus fleet. This is a low level client that does very little transformation on the
responses from the API.

[Metro Realtime API Overview](http://developer.metro.net/introduction/realtime-api-overview/)

## Installation

```bash
yarn install metro-realtime-client
```

## Usage

All functions export a Promise that can be used then `.then` or `async/await`.

```javascript
var client = require("metro-realtime-client");

// All functions return a Promise...
client
  .listAgencies()
  .then(agencies => {
    // all calls to the client return a promise...
  })
  .catch(err => {
    // ...
  });

// ...so async/await works as well
const agencies = await client.listAgencies();
```

```javascript
// Multiple entity getters
client.listAgencies();
client.listRoutes("lametro");
client.listStops("lametro");
client.listVehicles("lametro"); // All vehicles for the entire agency
client.listVehicles("lametro", "901"); // All vehicles for a specific route

// Single entity getters
client.getAgency("lametro");
client.getRoute("lametro", "901");
client.getStop("lametro", "15436");
```
