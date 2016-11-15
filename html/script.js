// var socketio = io.connect('http://localhost:3000')
var socketio = io.connect('http://192.168.0.5:3000')

socketio.on('connected', function (name) {})
socketio.on('publish', function (data) {
    addMessage(data.value)
})
socketio.on('recievScore', function (data) {
    console.log(data)
    rewriteScore(data)
})
socketio.on('requestScore', function (data) {
    rewriteScore(data)
})
socketio.on('disconnect', function () {})

var start = function (name) {
    $('#userName').html(name)
    socketio.emit('connected', name)
}


var regex = new RegExp(/^score/)
var publishMessage = function () {
    // var textInput = document.getElementById('textbox')
    var textInput = $('#textbox')
    if(regex.test(textInput.val())) {
        // console.log('ok')
        socketio.emit('sendScore', {value: textInput.val()})
    }
    var msg = '[' + myName + '] ' + textInput.val()
    socketio.emit('publish', {value: msg})
    // textInput.value = ''
    textInput.val('')
}

var tradeScore = function () {
    
}

var messageList = []
var addMessage = function (msg) {
    // var domMsg = document.createElement('div')
    // domMsg.innerHTML = new Date().toLocaleTimeString() + ' ' + msg
    // msgArea.appndChiled(domMsg)
    var maxConts = 10
    messageList.push(msg)
    $('#chatHistory').empty()
    if (messageList.length <= maxConts) {
        for (var i = 0; i < messageList.length; i++) {
            var domMsg = $('<div>').html(new Date().toLocaleTimeString() + ' ' + messageList[i])
            $('#chatHistory').append(domMsg)
        }
    } else {
        messageList.shift()
        for (var i = 0; i < maxConts; i++) {
            var domMsg = $('<div>').html(new Date().toLocaleTimeString() + ' ' + messageList[i])
            $('#chatHistory').append(domMsg)
        }
    }
}

var rewriteScore = function (data) {
    var players = [ {player: 'p1', score: data['p1']},
                    {player: 'p2', score: data['p2']},
                    {player: 'p3', score: data['p3']},
                    {player: 'p4', score: data['p4']} ]
    players.sort(function (a, b) {
        if (a.score > b.score) {
            return -1
        }
        if (a.score < b.score) {
            return 1
        }
        return 0
    })
    var max = Math.max.apply(null, players.map((item) => {return item.score}))
    $('#scoreTableBody').empty()
    for(var i in players) {
        var str = '<tr>'
        str += `<td>${players[i].player}</td>`
        str += `<td>${players[i].score}</td>`
        str += `<td>${players[i].score - max}</td>`
        str += '</tr>'
        $('#scoreTableBody').append(str)
    }
}

// var msgArea = document.getElementById('chatHistory')
var myName = Math.floor(Math.random() * 100)
addMessage('ようこそ、' + myName + 'さん！')
start(myName)

$(function () {
    $('.wind').click(function (e) {
        $('.wind').removeClass('active')
        $(this).addClass('active')
    })
})