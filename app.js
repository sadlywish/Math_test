var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var questions = require('./src/MakeQuestions');


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.set('port', process.env.PORT || 3000);
var http = require('http');
var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
var room1Question = questions.newQuestion(2,5,0.2,3,10);
var room1Time = null;
room1Time = setTimeout(function(){
    io.sockets.emit('lastresult','题目超时');
    console.log('time out!');
    newQuestion();
},25000);
console.log('time recode');
var io = require('socket.io').listen(server);
//var fileList =new Array();
io.sockets.on('connection', function(socket) {
    console.log('connection!!');
    sendQuestion(socket);
    socket.on('refresh',function(data){
        sendQuestion(socket);
    });
    socket.on('answer',function(data){
        console.log(data);
        if(data == Math.round(room1Question.getValue()*1000)/1000){
            newQuestion();
            socket.emit('lastresult','回答正确');
        }else{
            socket.emit('lastresult','回答错误');
        }
    });
});



function newQuestion(){
    if(room1Time!=null){
        clearTimeout(room1Time);
    }
    room1Question = questions.newQuestion(2,5,0.2,3,10);
    console.log((room1Question.getView()+' = '+Math.round(room1Question.getValue()*1000)/1000));
    io.sockets.emit('game',room1Question.getView()+' =  ');
    room1Time = setTimeout(function(){
        io.sockets.emit('lastresult','题目超时');
        console.log('time out!');
        newQuestion();
    },25000);
    console.log('time recode');
}
function sendQuestion(socket){
    console.log((room1Question.getView()+' = '+Math.round(room1Question.getValue()*1000)/1000));
    socket.emit('game',room1Question.getView()+' =  ');
}



