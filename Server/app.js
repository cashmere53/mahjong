var http = require('http')
var socket = require('socket.io')
var fs = require('fs')

var settings = require('./portSettings')
console.log(settings)

var dir = __dirname + '/../'
var server = http.createServer()
server.on('request', (req, res) => {
    switch (req.url) {
    case '/':
        fs.readFile(dir + 'html/index.html', 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/plane'})
                res.write('Not Found')
                return res.end
            }

            res.writeHead(200, {'Content-Type': 'text/html'})
            res.write(data)
            res.end()
        })
        break

    case '/bootstrap':
        fs.readFile(dir + 'bower_components/bootstrap/dist/js/bootstrap.min.js', 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/plane'})
                res.write('Not Found')
                return res.end
            }

            res.writeHead(200, {'Content-Type': 'text/javascript'})
            res.write(data)
            res.end()
        })
        break

    case '/jquery':
        fs.readFile(dir + 'bower_components/jquery/dist/jquery.min.js', 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/plane'})
                res.write('Not Found')
                return res.end
            }

            res.writeHead(200, {'Content-Type': 'text/javascript'})
            res.write(data)
            res.end()
        })
        break

    default:
        res.writeHead(404, {'Content-Type': 'text/plane'})
        res.write('wrong address')
        res.end()
    }
})
server.listen(settings.port, settings.host)

var io = socket.listen(server)
io.sockets.on('connection', function (client) {
    client.on('event', function () {})
    client.on('disconnect', function () {})
})