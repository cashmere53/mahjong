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
io.on('connection', (client) => {
    client.on('event', (data) => {

    })

    client.on('message', (preData) => {
        var data = JSON.parse(preData)
        var d = new Date()
        data.time = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
        data = JSON.stringify(data)
        console.log('\033[96m' + data + '\033[39m')

        server.clients.foreach(function (client) {
            client.send(data)
        })
    })
    
    client.on('disconnect', () => {
        
    })
})
server.listen(settings.port, settings.host)
