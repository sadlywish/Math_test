var app = angular.module('app',[]);
var socket = io.connect(null);
app.controller('questionController',function($scope){
    $scope.question = '';
    $scope.answer = '';
    $scope.result=' '
    $scope.sendAnswer = function(){
        socket.emit('answer',$scope.answer);
    }
    socket.on('game',function(data){
        $scope.$apply(function(){
            console.dir(data);
            $scope.question=data;
            $scope.answer = '';
        });
    });
    socket.on('lastresult',function(data){
        $scope.$apply(function(){
            $scope.result=data;
        })
    });
});
//socket.emit('refresh','');


