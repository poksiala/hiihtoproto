const rpio = require('rpio')
const wss = require('websocket').server
const http = require('http')

const BIOPIN = 7
const MIXEDPIN = 8
const PIN_NAMES = {7: 'bio', 8: 'mixed'}
const PINS = [BIOPIN, MIXEDPIN]

var clients = []

const server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new wss({
    httpServer: server,
    autoAcceptConnections: false
});

wsServer.on('request', function(request) {
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    clients.push(connection)

    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

const handlePinChange = (pin) => {
    const state = (rpio.read(pin) === 1)
    const name = PIN_NAMES[pin]
    const payload = {}
    payload[name] = state
    console.log(name, state, payload)
    clients.forEach((c) => c.send(JSON.stringify(payload)))
}

PINS.forEach((id) => {
  rpio.open(id, rpio.INPUT)
  rpio.poll(id, handlePinChange, rpio.POLL_HIGH)
})

