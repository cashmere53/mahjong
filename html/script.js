var ws = new WebSocket('ws://localhost:3000')

ws.onerror = function (err) {
    $('#chat-area').empty()
        .addCladd('alert alert-error')
        .applend('<button type="button" class="close" data-dismiss="alert">x</button>',
            $('<i/>').addClass('icon-warning-sign'),
            'cannot connect server'
        )
}

var userName = 'guest' + Math.floor(Math.random() * 100)
$('#user-name').append(userName)

ws.onopen = function () {
    $('#textbox').focus()
    ws.send(JSON.stringify({
        type: 'join',
        user: userName
    }))
}

ws.onmessage = function (event) {
    var data = JSON.parse(event.data)
    var item = $('<li/>').append(
        $('<div/>').append(
            $('<i/>').addClass('icon-user'),
            $('<small/>').addClass('meta chat-time').append(data.time)
        )
    )

    if (data.type === 'join') {
        item.addClass('alert alert-info')
            .prepend('<button type="button" class="close" data-dismiss="alert">×</button>')
            .children('div').children('i').after(data.user + 'が入室しました')
    } else if (data.type === 'chat') {
        item.addClass('well well-small')
            .append($('<div/>').text(data.text))
            .children('div').children('i').after(data.user)
    } else if (data.type === 'defect') {
       item.addClass('alert')
            .prepend('<button type="button" class="close" data-dismiss="alert">×</button>')
            .children('div').children('i').after(data.user + 'が退室しました')
    } else {
        item.addClass('alert alert-error')
            .children('div').children('i').removeClass('icon-user').addClass('icon-warning-sign')
            .after('不正なメッセージを受信しました')
    }
    $('#chat-history').prepend(item).hide().fadeIn(500)
}

// 発言イベント
textbox.onkeydown = function(event) {
    // エンターキーを押したとき
    if (event.keyCode === 13 && textbox.value.length > 0) {
        ws.send(JSON.stringify({
            type: 'chat',
            user: userName,
            text: textbox.value
        }))
        textbox.value = ''
    }
}
 
// ブラウザ終了イベント
window.onbeforeunload = function () {
    ws.send(JSON.stringify({
        type: 'defect',
        user: userName,
    }))
}