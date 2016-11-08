var socketio = io.connect('http://localhost:3000')

socketio.on('connected', function (name) {})
socketio.on('publish', function (data) {
    addMessage(data.value)
})
socketio.on('disconnect', function () {})

var start = function (name) {
    socketio.emit('connected', name)
}

var publishMessage = function () {
    var textInput = document.getElementById('textbox')
    var msg = '[' + myName + '] ' + textInput.value
    socketio.emit('publish', {value: msg})
    textInput.value = ''
}

var addMessage = function (msg) {
    var domMsg = document.createElement('div')
    domMsg.innerHTML = new Date().toLocaleTimeString() + ' ' + msg
    msgArea.appndChiled(domMsg)
}

var msgArea = document.getElementById('chatHistory')
var myName = Math.floor(Math.random() * 100)
addMessage('ようこそ、' + myName + 'さん！')
start(myName)