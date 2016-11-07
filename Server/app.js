var http = require('http')
var socket = require('socket.io')
var fs = require('fs')
var settings = require('./portSettings')

var server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end(fs.readFileSync('html/index.html'))
}).listen(settings.port, settings.host)

var io = socket.listen(server)
io.sockets.on('connection', function (client) {
    client.on('event', function () {})
    client.on('disconnect', function () {})
})