// SERVER
var random = require('random-js');
var http = require('http');
var socketIO = require('socket.io');
var port = process.env.PORT || 8080;

var ip = process.env.IP || '127.0.0.1';

server = http.createServer().listen(port, ip, function(){
    console.log('Socket.IO server started at %s:%s!', ip, port);
});

io = socketIO.listen(server);
var usernames 	= [];
var clickX=[];
var clickY=[];
var clickDrag=[];
var colors=['#D32F2F','#F44336','#7B1FA2','#FFC107','#7C4DFF','#673AB7','#536DFE','#2196F3','#009688','#388E3C','#8BC34A','#AFB42B','#FFEB3B','#FFA000','#FFA000','#E64A19','#795548','#9E9E9E','#607D8B'];
io.sockets.on('connection', function(socket){
	socket.on('add-user', function(username){
		socket.username=username;
		var randomIndex = Math.floor((Math.random())*18);
		//console.log(randomIndex);
		var color= colors[randomIndex];
		socket.color = color;// get random color
		//console.log(colors);
		var u={username:username, color:color}
		socket.emit('get-color',socket.color);
		usernames.push(u);
		io.sockets.emit('update-user',usernames);
	});
	socket.on('draw', function(data){
		clickX.push(data.x);
		clickY.push(data.y);
		clickDrag.push(data.dragging);
		io.sockets.emit('update-draw', clickX, clickY, clickDrag);
	});

	socket.on('clear', function(){
		clickX.length=0;
		clickY.length=0;
		clickDrag.clear=0;
		io.sockets.emit('update-draw', clickX, clickY, clickDrag);
	})
});