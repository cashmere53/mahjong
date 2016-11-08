// var http = require('http')
// var ws = require('websocket.io')
var fs = require('fs')
// var server = http.createServer()
var settings = require('./portSettings')
console.log(settings)

var http = require('http')
var server = http.createServer()
var io = require('socket.io')(server)

var dir = __dirname + '/../'
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

    case '/bootstrap-css':
        // fs.readFile(dir + 'bower_components/bootstrap/dist/css/bootstrap.min.css', 'utf-8', (err, data) => {
        fs.readFile(dir + 'bootstrap_readable.min.css', 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/plane'})
                res.write('Not Found')
                return res.end
            }

            res.writeHead(200, {'Content-Type': 'text/css'})
            res.write(data)
            res.end()
        })
        break

    case '/style':
        fs.readFile(dir + 'html/style.css', 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/plane'})
                res.write('Not Found')
                return res.end
            }

            res.writeHead(200, {'Content-Type': 'text/css'})
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

    case '/socket.io':
        fs.readFile(dir + 'node_modules/socket.io/lib/socket.js', 'utf-8', (err, data) => {
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

    case '/script':
        fs.readFile(dir + 'html/script.js', 'utf-8', (err, data) => {
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

var usrHash = {}
io.on('connection', (client) => {
    client.on('connected', (name) => {
        var msg = name + 'さんが入室しました。'
        usrHash[client.id] = name
        io.emit('publish', {value: msg})
    })

    client.on('publish', (data) => {
        io.emit('publish', {value: data.value})
    })
    
    client.on('disconnect', () => {
        if (usrHash[client.id]) {
            var msg = usrHash[client.id] + 'さんが退出しました。'
            delete usrHash[client.id]
            io.emit('publish', {value: msg})
        }
    })
})
server.listen(settings.port, settings.host)
