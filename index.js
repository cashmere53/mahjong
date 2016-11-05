/// <reference path="typings/tsd.d.ts" />

var ws = require('websocket.io')
var server = ws.listen(8888, function() {
    console.log('ode.js is listening to PORT:' + server.address().port)
})
