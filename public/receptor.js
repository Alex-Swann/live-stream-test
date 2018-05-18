var img;

function init() {
    img = document.getElementById('frame');
}

$(document).ready(function (){
    init();
});

if ('WebSocket' in window) {
    connect('ws://127.0.0.1:8080/');
} else {
    console.log('web sockets not suported');
}

var ws;

function connect(host) {
    ws = new WebSocket(host);

    ws.onopen = function () {
        console.log('connected');
    }

    ws.onmessage = function (evt) {
        if (evt.data != null) {
            if ((evt.data[0] == 'd') && (evt.data[1] == 'a'))
                img.src = evt.data;
        }
    }

    ws.onclose = function () {
        console.log('closed');
    }

    ws.onerror = function(evt) {
        console.log('<span style="color: red;">ERROR:</span> ' + evt.data);
    }
}

function send(msg) {
    if (ws != null) {
        if (ws.readyState === 1)
            ws.send(msg);
    } else {
        console.log('not ready yet');
    }
}

cw = video.clientWidth;
ch = video.clientHeight;
back.width = cw;
back.height = ch;
draw(video, backcontext, cw, ch);

function draw(v, bc, w, h) {
    bc.drawImage(v, 0, 0, w, h);

    var stringData = back.toDataURL();

    send(stringData);

    setTimeout(function() { draw(v, bc, w, h) });
}