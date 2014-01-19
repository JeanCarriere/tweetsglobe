module.exports = {
	startServer: function() {
		var express = require('express')
		, io = require('socket.io')
		  , http = require('http')
		  , twitter = require('ntwitter')
		  , cronJob = require('cron').CronJob
		, app = express();

		app.configure(function() {

			app.use(express.errorHandler({
				dumpExceptions: true,
				showStack: true
			}));

			app.use(express.logger({
				format: ':method :url'
			}));

			app.use(express.bodyParser());

			// Gzip content
			app.use(express.compress());

			app.use(express.static(__dirname + "/public"));

			return app.use(express.methodOverride());
		});

		//Start a Socket.IO listen
		var server = http.createServer(app);
		var sockets = io.listen(server);

		//Set the sockets.io configuration.
		//THIS IS NECESSARY ONLY FOR HEROKU!
		sockets.configure(function() {
		  sockets.set('transports', ['xhr-polling']);
		  sockets.set('polling duration', 10);
		});

		sockets.sockets.on('connection', function(socket) {
			console.log('socket connection');
		    socket.emit('data', "test");
		});

		var twit = new twitter({
		    consumer_key: 'ri5WQW4DzzccwjAPJpDDtQ',           // <--- FILL ME IN
		    consumer_secret: 'ifl4jMT4eCkUgXas9WnYG240X39xJ79367KyJxTJA',        // <--- FILL ME IN
		    access_token_key: '280501352-7farYieTegcuYipnkArTYgxFd1TTmLIZTqVzA1VD',       // <--- FILL ME IN
		    access_token_secret: 'oacygZE7tDPqIqK8bLT1Zs9cmxsDtqyPg1ytOwaPvcF4b'     // <--- FILL ME IN
		});

		twit.stream('statuses/filter', {'locations':'-122.75,36.8,-121.75,37.8,-74,40,-73,41'}, function(stream) {
		  stream.on('data', function (data) {
		  	sockets.sockets.emit('data', data);
		    //console.log(data);
		  });
		});
		app.get('/', function(request, response) {
			return response.sendfile('public/index.html');
		});

		return server.listen(process.env.PORT || 3333, function() {
			return console.log("Listening on port 3333…");
		});
	}
};