'use strict';

/* App Module */


var matchApp = angular.module('matchApp',[
    'ngRoute'
]);
var socket = io.connect(null);
socket.on('test',function(data){
    socket.emit('test',data);
});
var loginState = false;
var roomNames = ['初级房间','中级房间','高级房间'];
matchApp.controller('questionController',function($scope,$location,$routeParams){
    $scope.roomNum = $routeParams.id;
    $scope.roomName = roomNames[$scope.roomNum];
    $scope.question = '';
    $scope.answer = '';
    $scope.result = '';
    $scope.gameinfo = '';
    $scope.leaderList =[];
    $scope.sendAnswer = function(){
        socket.emit('answer',{roomNum:$scope.roomNum,answer:$scope.answer});
    };
    socket.on('game',function(data){
        $scope.$apply(function(){
            $scope.question = data;
            $scope.answer = '';
        });
    });
    socket.on('gameno',function(data){
        $scope.$apply(function(){
            $scope.gameinfo = data;
        });
    });
    socket.on('lastresult',function(data){
        $scope.$apply(function(){
            $scope.result=data;
        })
    });
    socket.on('gameinfo',function(data){
        $scope.$apply(function(){
            $scope.leaderList=data;
        })
    });
    socket.on('gameend',function(data){
        $scope.$apply(function(){
            $location.path("/finish");
        })
    });
});
matchApp.controller('loginController',function($scope,$location){
    if(!loginState){
        $scope.userName='请登陆系统';
    }
    $scope.errorInfo= '';
    $scope.loginName = '';
    $scope.password = '';
    $scope.returnInformation = '';
    $scope.logoutHide=true;
    $scope.loginHide=false;
    $scope.login = function(){
        console.log( $scope.loginName);
        socket.emit('login', {loginName: $scope.loginName, password: $scope.password});
    };
    $scope.logout = function(){
        socket.emit('logout','');
//        $location.path("/longin");
    };
    $scope.register = function(){
        socket.emit('register','');
//        $location.path("/wait");
    };
    socket.on('login',function(data){
        $scope.$apply(function() {
            $scope.userName =data;
            $location.path("/rule1");
            loginState=true;
            $scope.loginName = '';
            $scope.password = '';
            $scope.returnInformation = '';
        });
    });
    socket.on('logout',function(data){
        $scope.$apply(function() {
            $scope.userName ='请登陆系统';
            $location.path("/login");
            loginState=false;
            $scope.loginName = '';
            $scope.password = '';
            $scope.returnInformation = '';
        });
    });
    socket.on('logerror',function(data){
        $scope.$apply(function() {
            $scope.loginName = '';
            $scope.password = '';
            $scope.returnInformation = data;
        });
    })
});
matchApp.controller('waitController',function($scope,$location,$routeParams){
    var id  =$routeParams.id;
    console.log(id);
    socket.emit('wait',id);
    $scope.state = 0;
    $scope.waitInfo = '';
    $scope.buttonState = '准备';
    $scope.ready = function(){
        if($scope.state ==0){
            socket.emit('join',id);
            $scope.state = 1;
            $scope.buttonState = '取消准备';
        }else{
            socket.emit('leave',id);
            $scope.state = 0;
            $scope.buttonState = '准备';
        }
    };
    socket.on('waitinfo',function(data){
        $scope.$apply(function(){
            var roomNumber= id;
            roomNumber++;
            if(data.roomNum == id) {
                $scope.waitInfo = '当前房间为：' + 'Room' + roomNumber + ':' + roomNames[id] + ',' + data.info;
            }
        });
    });
    socket.on('gameready',function(data){
        $scope.$apply(function(){
            $location.path("/room/"+data);
        });
    });
});
matchApp.controller('rulesController1',function($scope,$location){
    socket.emit('rule','');
    $scope.rule1 = '';
    $scope.rule2 = '';
    $scope.rule3 = '';
    socket.on('rules',function(data){
        $scope.$apply(function() {
//            console.log(data[0]);
            $scope.rule1 = data[0][0];
            $scope.rule2 = data[0][1];
            $scope.rule3 = data[0][2];
        });
    });
});
matchApp.controller('rulesController2',function($scope,$location){
    socket.emit('rule','');
    $scope.rule1 = '';
    $scope.rule2 = '';
    $scope.rule3 = '';
    socket.on('rules',function(data){
        $scope.$apply(function() {
//            console.log(data[0]);
            $scope.rule1 = data[1][0];
            $scope.rule2 = data[1][1];
            $scope.rule3 = data[1][2];
        });
    });
});
matchApp.controller('rulesController3',function($scope,$location){
    socket.emit('rule','');
    $scope.rule1 = '';
    $scope.rule2 = '';
    $scope.rule3 = '';
    socket.on('rules',function(data){
        $scope.$apply(function() {
//            console.log(data[0]);
            $scope.rule1 = data[2][0];
            $scope.rule2 = data[2][1];
            $scope.rule3 = data[2][2];
        });
    });
});
matchApp.controller('historyController',function($scope,$location){
    socket.emit('history','');
    socket.on('userinfo',function(data){
        $scope.$apply(function() {
            $scope.room1 = [];
            $scope.room2 = [];
            $scope.room3 = [];
            for(var i=0;i<data.length;i++){
                switch (data[i].roomNum){
                    default:
                        break;
                    case 0:
                        $scope.room1.push(data[i]);
                        break;
                    case 1:
                        $scope.room2.push(data[i]);
                        break;
                    case 2:
                        $scope.room3.push(data[i]);
                        break;
                }
            }
        });
    });
});
matchApp.controller('finishController',function($scope,$location){
    $scope.name ='';
    $scope.grade = 0;
    $scope.no = 1;
    $scope.list = [];
    socket.on('endinfo',function(data) {
        $scope.$apply(function(){
            console.log('end');
            $scope.no = data.no;
            $scope.grade = data.grade;
        });
    });
});
matchApp.config(['$routeProvider',
  function($routeProvider) {
		$routeProvider.			
			when('/login', {
				template: document.getElementById('loginView').text,
				controller: 'loginController'
			}).
			when('/rule1', {
				template: document.getElementById('rule1View').text,
				controller: 'rulesController1'
			}).when('/rule2', {
                template: document.getElementById('rule2View').text,
                controller: 'rulesController2'
            }).when('/rule3', {
                template: document.getElementById('rule3View').text,
                controller: 'rulesController3'
            }).
			when('/room/:id',{
				  template:document.getElementById('roomView').text,
				  controller:'questionController'
			}).
			when('/history', {
				template:document.getElementById('historyView').text,
				controller: 'historyController'
			}).
			when('/wait/:id', {
				template: document.getElementById('waitView').text,
				controller: 'waitController'
			}).
			when('/finish', {
				template: document.getElementById('finishView').text,
				controller: 'finishController'
			}).
			otherwise({
				redirectTo: '/login'
			});
  }]);
