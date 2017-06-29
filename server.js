const app = require('express')()
const http = require('http')
const WebSocket = require('ws')
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

const port = process.env.PORT || 3000
var intervalId;

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html')
})

wss.on('connection', function connection(ws, req) {
	//const location = url.parse(req.url, true);
	// You might use location.query.access_token to authenticate or share sessions 
	// or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

	broadcast('chat', 'client connected...server running on port: ' + port)
	console.log('client connected')

	ws.on('close', _ => {
		if (intervalId) {
			clearInterval(intervalId)
		}
		console.log('client disconnected')
	})

	ws.on('message', function incoming(message) {
		broadcast('chat', message)
	});

	intervalId = setInterval(_ => {
		try {
			broadcast('time', new Date().toString())
		} catch (e) {
			console.log('error: %s', e)
		}
	}, 1000)

});

function broadcast(type, message) {
	const response = {
		timestamp: new Date().getTime(),
		type: type,
		message: message
	}
	wss.clients.forEach(function each(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify(response))
		}
	})
	console.log('broadcast: %s', message)	
}

server.listen(port, function listening() {
	console.log('Listening on %d', server.address().port);
});