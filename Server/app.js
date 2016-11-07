var fs = require('fs')
var ws = require('websocket.io')
var http = require('http')createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    var output = fs.readFileSync('../html/index.html', 'utf-8')
    res.end(output)
}).listen(3000)
var server = ws.attach(http)

server.on('connection', function (socket) {
    socket.on('message', function (data) {
        
    })
})
