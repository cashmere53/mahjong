var ws = require('websocket.io')
var http = require('http').createServer().listen(3000)
var server = ws.attach(http)

server.on('connection', function (client) {
  client.on('message', function () { })
  client.on('close', function () { })
})