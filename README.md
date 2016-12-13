Los Angeles Metro provides a RESTful API to retrieve realtime positions of their
bus fleet. This is a low level client that does very little transformation on the
responses from the API.

[Metro Realtime API Overview](http://developer.metro.net/introduction/realtime-api-overview/)

## Installation

```bash
npm install metro-realtime-client
```

## Usage

The client has two functions:  `list` and `get`. Each lead to a fluent interface
that allows the caller to set context and then end with the desired resource type.

```javascript
var client = require('metro-realtime-client')

// list resources
client.list().agencies()                                        // agencies
.then((agencies) => {
    // all calls to the client return a promise...
})
.catch((err) => {
    // ...
})

client.list().fromAgency('lametro').routes()                    // all agency routes
client.list().fromAgency('lametro').onRoute('950').stops()      // all stops on route 950
client.list().fromAgency('lametro').vehicles()                  // all agency vehicles
client.list().fromAgency('lametro').onRoute('950').vehicles()   // all vehicles on route 950


// get a specific resource
client.get().agency('lametro')                                  // get 'lametro' agency
client.get().fromAgency('lametro').route('950')                 // get details about route 950
client.get().fromAgency('lametro').stop('90')                   // get details about stop 90
```

## CLI

A very basic CLI exists to make it easy to play with from the command line. It is
installed in `node_modules/.bin/metro-realtime-cli`.

```
Usage: cli [options] [command]


Commands:

    list-agencies                   get a list of agencies
    get-agency <id>                 get information about a specific agency
    list-routes <agency>            get a list of routes for a specific agency
    get-route <agency> <id>         get information about a specific routes
    list-stops <agency> <route>     get a list of stops on a route
    get-stop <agency> <id>          get information about a specific stop
    list-vehicles <agency> [route]  get a list of vehicles for a specific agency

Options:

    -h, --help     output usage information
    -V, --version  output the version number
    --raw          print raw json instead of pretty printing    
```

## Tests

```bash
npm run test        # all test types
npm run test:unit   # just unit tests
```