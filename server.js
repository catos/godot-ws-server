var app = require('express')()
var server = require('http').Server(app)
var io = require('socket.io')(server)

var port = process.env.PORT || 3000

var connections = []

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
	connections.push(socket)
	console.log('Connected: %s clients connected', connections.length)

	socket.on('message', function (message) {
		console.log('message from client: ', message)
		io.emit('message', 'echo from server, message: ' + message)
	})

	socket.on('disconnect', (reason) => { 
		connections.splice(connections.indexOf(socket), 1)
		console.log('client disconnect, reason: ', reason)
	})

	// Disconnect clients after 5 seconds
	// setTimeout(() => socket.disconnect(true), 5000)
})

server.listen(port, _ => {
	console.log('listening on *:' + port)
})