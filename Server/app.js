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
        fs.readFile(dir + 'node_modules/socket.io-client/socket.io.js', 'utf-8', (err, data) => {
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

    // default:
    //     res.writeHead(404, {'Content-Type': 'text/plane'})
    //     res.write('wrong address')
    //     res.end()
    //     break
    }
})

var usrHash = {}
var score = {'p1': 25000, 'p2': 25000, 'p3': 25000, 'p4': 25000}
io.on('connection', (client) => {
    client.on('connected', (name) => {
        var msg = name + 'さんが入室しました。'
        usrHash[client.id] = name
        io.emit('publish', {value: msg})
        io.emit('requestScore', score)
        // console.log(name + 'さんが入室しました。')
    })

    client.on('publish', (data) => {
        io.emit('publish', {value: data.value})
    })
    
    client.on('sendScore', (data) => {
        /*
        data type:
        親ツモ -> score <player> <score>
            ex. score p1 4000 (親のp1が4000オールのツモ和了り)
        ロン -> score <from> <to> <score>
            ex. score p2 p3 7700 (p2がp3からの出和了り7700点)
        子ツモ -> score <player> <parent> <pScore> <cScore>
            ex. score p1 p4 4000 2000 (子のp1が([p2, p3]2000, [p4]4000)のツモ和了り)
        */
        var splited = data.value.split(' ')
        if(splited.length === 3) {
            var player = splited[1]
            var minusScore = Number(splited[2])
            for(var p in score) {
                if (p !== player) {
                    score[p] -= minusScore
                } else {
                    score[p] += minusScore * 3
                }
            }
        } else if (splited.length === 4) {
            var fm = splited[2]
            var to = splited[1]
            var moveScore = Number(splited[3])
            score[fm] -= moveScore
            score[to] += moveScore
        } else if (splited.length === 5) {
            var win = splited[1]
            var par = splited[2]
            var movePScore = Number(splited[3])
            var moveCScore = Number(splited[4])
            for(var m in score) {
                switch(m){
                case win:
                    score[win] += movePScore + moveCScore * 2
                    break
                case par:
                    score[par] -= movePScore
                    break
                default:
                    score[m] -= moveCScore
                    break
                }
            }
        }
        
        io.emit('recievScore', score)
    })

    client.on('requestScore', () => {
        io.emit('requestScore', score)
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
