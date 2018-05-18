var express = require('express');
var http = require('http');
var app = express();
var path = require('path');
var WebSocket = require('ws');
var PORT = 8080;

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, 'public')));

var clients = [];

wss.on("connection", function(websocket) {
    clients.push(websocket);


    websocket.on('message', function(data) {
        for (var i = 1; i < clients.length; i++) {
           clients[i].send(data);
        }
    });

    websocket.on('close', function() {

        for (var i = 0; i < clients.length; i++) {
            if (clients[i] == websocket) {
                clients.splice(i);
                break;
            }
        }
    });
});


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/layout.html'));
});

app.get('/transmissor', function(req, res) {
    res.sendFile(path.join(__dirname + '/transmissor.html'));
});

app.get('/receptor', function(req, res) {
    res.sendFile(path.join(__dirname + '/receptor.html'));
});

server.listen(PORT, function() {
  console.log('Example server listening on port ' + PORT);
});

