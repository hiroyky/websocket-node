const ws = require('websocket.io');
const http = require('http');
const express = require('express');

const wss = ws.listen(8888, () => {
    console.log("start ws://localhost:8888");
});

wss.on('connection', (socket) => {
    console.log((new Date()) + ' connection accepted');
    socket.on('message', onMessage);
    socket.on('close', onClose);
});

function onMessage(message) {
    console.log('onMessage: ' + message);
}

function onClose() {
    console.log((new Date()) + 'Close.');
}

const app = express();
const server = http.createServer(app);

const router = express.Router();
app.use('/', express.static('./'));
app.use('/', router);
router.get('/api/color', (req, res) => {
    wss.clients.forEach((client) => {
        console.log("send: " + req.query.color);
        client.send(req.query.color);
    });

    res.writeHead(200);
    res.end('ok');
});

server.listen(8080, () => {
    console.log("start http://localhost:8080");
})

