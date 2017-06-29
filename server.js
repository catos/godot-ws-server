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
	const response = {
		timestamp: new Date().getTime(),
		type: 'chat',
		message: 'client connected...server running on port: ' + port
	}
	ws.send(JSON.stringify(response))
	console.log('client connected')

	ws.on('close', _ => {
		if (intervalId) {
			clearInterval(intervalId)
		}
		console.log('client disconnected')
	})

	ws.on('message', function incoming(message) {
		const response = {
			timestamp: new Date().getTime(),
			type: 'chat',
			message: message
		}
		ws.send(JSON.stringify(response))
		console.log('received: %s', message)
		// console.log(req);
	});

	intervalId = setInterval(_ => {
		try {
			const now = new Date()
			const response = {
				timestamp: new Date().getTime(),
				type: 'time',
				message: now.toString()
			}
			ws.send(JSON.stringify(response))
		} catch (e) {
			console.log('error: %s', e)
		}
	}, 1000)

});

server.listen(port, function listening() {
	console.log('Listening on %d', server.address().port);
});