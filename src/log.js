"use strict"

let bunyan = require("bunyan")


// create the root logger
let log = bunyan.createLogger({ name: "metro-realtime-client" })


module.exports = (submodule) => log.child({ submodule: submodule })
