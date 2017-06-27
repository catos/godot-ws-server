var server = require('http').createServer();
var io = require('socket.io')(server);

io.on('connection', function (client) {
	
	client.on('event', function (data) {
		console.log('client event', data);
	});

	client.on('disconnect', function () { 
		console.log('client disconnect');
	});

});

server.listen(3000);