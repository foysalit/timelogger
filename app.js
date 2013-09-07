
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , log = require('./routes/api/log')
  , http = require('http')
  , path = require('path');

var app = express(),
	server = http.createServer(app),
	io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/logs/user/:username', log.read_by_username);
app.get('/logs/project/:project', log.read_by_project);

app.post('/api/log/:port', function(req, res){
	log[req.params.port](req, function(ret){
		res.send(ret);
	});
});	

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


io.sockets.on('connection', function(socket){
	console.log(['yay! sockets', socket]);

	socket.on('logged', function(data){
		console.log(data);
	});
});