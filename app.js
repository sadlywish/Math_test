var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var questions = require('./src/MakeQuestions');
var DB = require('./src/DBdemo');

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
var server = http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
var io = require('socket.io').listen(server);
//var room1Question = questions.newQuestion(2, 3, 0.2, 1, 10);
//var room1Time = null;
//room1Time = setTimeout(function () {
//    io.sockets.emit('lastresult', '题目超时');
//    console.log('time out!');
//    newQuestion();
//}, 25000);
//console.log('time recode');
//var userList = io.sockets;
//console.log(userList);
var roomList = [new room("room1",5,10000,1,3,0,0,10,0),new room("room2",10,18000,1,3,0,2,10,1),new room("room3",15,25000,2,5,0.2,3,10,2)];

//var fileList =new Array();
var count = 1;
var nameTemp = '';
console.log(roomList[0].getRule());
io.sockets.on('connection', function (socket) {
//    console.log('connection!!');
    socket.login = false;
    socket.on('rule',function(){
        socket.emit('rules',[roomList[0].getRule(),roomList[1].getRule(),roomList[2].getRule()]);
    });
    socket.on('test',function(data){
        console.log(data);
    });
    socket.on('history',function(){
        console.log('history');
        emitUserInfo (socket);
    });
    socket.on('login', function (data) {
//        console.log(data);
        nameTemp = data.loginName;
        DB.login(data.loginName,data.password, function (data) {
            if (data) {
//                console.log(nameTemp);
                socket.login = true;
                socket.name = nameTemp;
                socket.emit('login',nameTemp);
                emitUserInfo(socket);
            } else {
                socket.emit('logerror', '登录失败，请检查用户名和密码是否正确');
            }
        });
    });

    socket.on('logout',function(data){
        socket.leaveAll();
        socket.login =false;
        socket.name = '';
        socket.emit('logout','');
    });
    socket.on('register',function(data){
        nameTemp = data.loginName;
        DB.register(data.loginName,data.password,function(data){
            if(data){
                socket.login = true;
                socket.name = nameTemp;
                socket.emit('login', nameTemp);
                emitUserInfo(socket);
            }else{
                socket.emit('logerror','注册失败，请更换用户名后再试');
            }
        });
    });
    socket.on('answer', function (data) {
//        console.log(data.anwser);
        roomList[data.roomNum].checkAnswer(data.answer,socket);
    });
    socket.on('path',function(data){
        if(socket.login){
            socket.emit('path',data);
        }else{
            socket.emit('stop','');
        }
    });
    socket.on('wait',function(data){
        roomList[data].getWaitInfo();
    });
    socket.on('join',function(data){
        roomList[data].join(socket);
    });
    socket.on('leave',function(data){
        roomList[data].leave(socket);
    })
});


//function newQuestion() {
//    if (room1Time != null) {
//        clearTimeout(room1Time);
//    }
//    room1Question = questions.newQuestion(2, 3, 0.2, 1, 10);
//    console.log((room1Question.getView() + ' = ' + Math.round(room1Question.getValue() * 1000) / 1000));
//    io.sockets.emit('game', room1Question.getView() + ' =  ');
//    room1Time = setTimeout(function () {
//        io.sockets.emit('lastresult', '题目超时');
//        console.log('time out!');
//        newQuestion();
//    }, 25000);
//    console.log('time recode');
//}
//function sendQuestion(socket) {
//    console.log((room1Question.getView() + ' = ' + Math.round(room1Question.getValue() * 1000) / 1000));
//    socket.emit('game', room1Question.getView() + ' =  ');
//}
function clients(roomName,callback){
    setTimeout(function() {
        var userList = io.sockets.sockets;
        var inRoomUser = [];
        var count = 0;
        for (i = 0; i < userList.length; i++) {
            var rooms = userList[i].rooms;
            for (j = 0; j < rooms.length; j++) {
                if (rooms[j] == roomName) {
                    inRoomUser[count] = userList[i];
                    count++;
                }
            }
        }
        callback(inRoomUser);
    },0);
}

function emitUserInfo(socket){
    DB.getTotalInfo(socket.name,function(data){
        socket.emit('userinfo',data);
    });
}

function room(roomName1, maxNum1, timeout1, min1, max1, rate1, mutirate1, maxNumber1,roomNum1) {
    var roomName = '';
    var question = null;
    var num = 0;
    var maxNum = 0;
    var timeout = 0;
    var start = false;
    var time =null;
    var min;
    var max;
    var rate;
    var mutirate;
    var maxNumber;
    var roomNum=0;
    var inti = function () {
        roomNum = roomNum1;
        roomName = roomName1;
        maxNum = maxNum1;
        timeout = timeout1;
        min = min1;
        max = max1;
        rate = rate1;
        mutirate = mutirate1;
        maxNumber = maxNumber1;
        question = questions.newQuestion(min, max, rate, mutirate, maxNumber);
    };
    inti();
    var getRoomName = function getRoomName() {
        return roomName;
    };
    var getWaitName = function getWaitName() {
        return roomName + 'Wait';
    };
    var newQuestion = function newQuestion() {
        if (time != null) {
            clearTimeout(time);
        }
        question = questions.newQuestion(min, max, rate, mutirate, maxNumber);
        console.log(Math.round(question.getValue()*1000)/1000);
        io.sockets.in(getRoomName()).emit('game',question.getView()+'=');
        io.sockets.in(getRoomName()).emit('gameno',getGameInfo());
        getWaitInfo();
        time = setTimeout(function () {
            io.sockets.in(getRoomName()).emit('lastresult', '题目超时');
            nextQuestion();
        }, timeout);
    };
    var newGame = function newGame() {
        clients(getWaitName(),function(waitList){
            io.sockets.in(getWaitName()).emit('gameready',roomNum);
            for(i = 0;i<waitList.length;i++){
                waitList[i].leave(getWaitName());
                waitList[i].join(getRoomName());
                waitList[i].grade=0;
            }
            start = true;
            getWaitInfo();
            getLeaderboard(function(data){
                io.sockets.in(getRoomName()).emit('gameinfo',data);
            });
            newQuestion();
        });
    };
    var nextQuestion = function nextQuestion() {
        num++;
        if (num < maxNum) {
            newQuestion();
        } else {
            start = false;
            getLeaderboard(function(leaderList) {
                for (i = 0; i < leaderList.length; i++) {
                    DB.saveGameInfo(leaderList[i].user, '2015/1/17', leaderList[i].no, leaderList[i].grade);
                }
            });
            getWaitInfo()
            clients(getRoomName(),function(userList) {
                var leaderboard = new Array(userList.length);
                for (i = 0; i < userList.length; i++) {
                    leaderboard[i] = {no: 0, user: userList[i].name, grade: userList[i].grade,socket:userList[i]};
                }
                var temp = null;
                for (i = 0; i < leaderboard.length; i++) {
                    for (j = i + 1; j < leaderboard.length; j++) {
                        if (leaderboard[i].grade < leaderboard[j].grade) {
                            temp = leaderboard[i];
                            leaderboard[i] = leaderboard[j];
                            leaderboard[j] = temp;
                            temp = null;
                        }
                    }
                    leaderboard[i].no = i + 1;
                }
                for(i = 0;i< leaderboard.length;i++){
                    leaderboard[i].socket.emit('gameend','');
                    leaderboard[i].socket.emit('endinfo', {no: leaderboard[i].no, grade: leaderboard[i].grade});
                }
            });
            clients(getRoomName(),function(playerList){
                for(i = 0;i<playerList.length;i++){
                    emitUserInfo(playerList[i]);
                    playerList[i].leave(getRoomName());
                }
                checkReady();
            });
        }
    };
    var getLeaderboard = function getLeaderboard(callback) {
        clients(getRoomName(),function(userList) {
            var leaderboard = new Array(userList.length);
            for (i = 0; i < userList.length; i++) {
                leaderboard[i] = {no: 0, user: userList[i].name, grade: userList[i].grade};
            }
            var temp = null;
            for (i = 0; i < leaderboard.length; i++) {
                for (j = i + 1; j < leaderboard.length; j++) {
                    if (leaderboard[i].grade < leaderboard[j].grade) {
                        temp = leaderboard[i];
                        leaderboard[i] = leaderboard[j];
                        leaderboard[j] = temp;
                        temp = null;
                    }
                }
                leaderboard[i].no = i + 1;
            }
            callback(leaderboard);
        });
    };
    var getGameInfo = function getGameInfo() {
        return '当前题目为第' + (num+1) + '/' + maxNum + '题';
    };
    var getWaitInfo = function getWaitInfo() {
        clients(getWaitName(),function(data){
            var info = '共有' + (data.length) + '名玩家在等待进入游戏';
            if (start) {
                info = info + ',' + getGameInfo();
            }
            io.sockets.emit('waitinfo',{roomNum:roomNum,info:info});
        });
    };
    var checkReady = function checkReady() {
        clients(getWaitName(),function(data) {
            if (!start && data.length > 1) {
                io.sockets.in(getWaitName()).emit('waitinfo',{roomNum:roomNum,info: '游戏将在10秒后开始，请未加入游戏的玩家尽快加入游戏'});
                setTimeout(function () {
                    newGame();
                }, 10000);
            }
        });
    };
    var checkAnswer = function checkAnswer(answer, socket){
        if(answer == (Math.round(question.getValue()*1000)/1000)){
            socket.broadcast.in(getRoomName()).emit('lastresult','上一题由'+socket.name+'回答正确');
            socket.emit('lastresult','回答正确');
            socket.grade = socket.grade+1;
            getLeaderboard(function(data){
                    io.sockets.in(getRoomName()).emit('gameinfo',data);
            });
            nextQuestion();
        }else{
            socket.emit('lastresult', '回答错误');
        }
    };
    var getRule = function getRule() {
        if (rate != 0) {
            return ['这个房间的单局游戏限定总题数：' + maxNum + '题','每题限定答题时间为：' + (timeout / 1000) + '秒','题目难度系数：' + (Math.round(maxNumber * (min + max + mutirate * 2) * (rate * 10) * 1000) / 1000)];
        } else {
            return ['这个房间的单局游戏限定总题数：' + maxNum + '题','每题限定答题时间为：' + (timeout / 1000) + '秒','题目难度系数：' + (Math.round(maxNumber * (min + max + mutirate * 2) * (0.5) * 1000) / 1000)];
        }
    };
    var join = function join(socket){
        socket.join(getWaitName());
        checkReady();
        console.log('join');
        getWaitInfo();
        socket.emit('addwait','')
    };
    var leave = function leave(socket){
        socket.leave(getWaitName());
        checkReady();
        getWaitInfo();
        socket.emit('leave','')
    };
    this.nextQuestion = nextQuestion;
    this.getGameInfo = getGameInfo;
    this.getLeaderboard = getLeaderboard;
    this.getRoomName = getRoomName;
    this.getRule = getRule;
    this.getWaitInfo = getWaitInfo;
    this.getReadyName = getWaitName;
    this.checkReady = checkReady;
    this.newGame = newGame;
    this.checkAnswer = checkAnswer;
    this.join = join;
    this.leave = leave;
}



