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
var client = require('metro-realtime-client')

// All functions return a Promise...
client.listAgencies()
.then((agencies) => {
    // all calls to the client return a promise...
})
.catch((err) => {
    // ...
})

// ...so async/await works as well
const agencies = await client.listAgencies()
```
```javascript
// Multiple entity getters
client.listAgencies()
client.listRoutes("lametro")
client.listStops("lametro")
client.listVehicles("lametro")         // All vehicles for the entire agency
client.listVehicles("lametro", "901")  // All vehicles for a specific route

// Single entity getters
client.getAgency("lametro")
client.getRoute("lametro", "901")
client.getStop("lametro", "15436")
```
