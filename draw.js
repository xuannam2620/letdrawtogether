var socket=io.connect('http://localhost:8080');

socket.on('connect', function(){
	socket.emit('add-user', prompt('What\'s your name'));
});

var colorStroke;

socket.on('update-user', function(usernames){
	$('.list-users').empty();
	$.each(usernames, function(key, value){
		$('.list-users').append('<p><span style="color:'+value.color+'">'+value.username+'</span></p>');
	});
});

socket.on('update-draw', function(clickX,clickY,clickDrag){
	redraw(clickX,clickY,clickDrag);
});

socket.on('get-color', function(data){
	colorStroke=data;
});

var canvas = document.getElementById('canvas');
var ctx= canvas.getContext('2d');
var paint=false;
// CLIENT
var bodyRect 			= document.body.getBoundingClientRect();
var canvasRect			= canvas.getBoundingClientRect();
var canvasOffsetTop 	= canvasRect.top-bodyRect.top;
var canvasOffsetLeft 	= canvasRect.left-bodyRect.left;

$('#canvas').mousedown(function(e){
	var mouseX= e.pageX-this.offsetLeft;
	var mouseY=e.pageY-this.offsetTop;
	paint = true;
	addClick(e.pageX-canvasOffsetLeft, e.pageY-canvasOffsetTop);
});

$('#canvas').mousemove(function(e){
	if(paint){
		addClick(e.pageX-canvasOffsetLeft, e.pageY-canvasOffsetTop,true);
	}
});

$('#canvas').mouseup(function(e){
	paint=false;
});

$('#canvas').mouseleave(function(e){
	paint=false;
});

/*var clickX=new Array();
var clickY=new Array();
var clickDrag=new Array();*/

function addClick(x,y, dragging){
	socket.emit('draw', {x,y,dragging});
	//console.log({x,y,dragging});
}

function redraw(clickX,clickY,clickDrag){
	ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);

	ctx.strokeStyle=colorStroke;
	ctx.lineJoin='round';
	ctx.lineWidth=5;

	for(var i=0;i<clickX.length;i++){
		ctx.beginPath();
		if(clickDrag[i]&&i){
			ctx.moveTo(clickX[i-1], clickY[i-1]);
		}else{
			ctx.moveTo(clickX[i]-1, clickY[i]-1);
		}
		ctx.lineTo(clickX[i],clickY[i]);
		ctx.closePath();
		ctx.stroke();
	}
}

$('#btn_clear').click(function(){
	socket.emit('clear');
});

function clearCanvas(){
	clickX.length=0;
	clickY.length=0;
	clickDrag.length=0;
	redraw();
}