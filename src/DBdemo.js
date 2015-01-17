/**
 * Created by user on 2015/1/15.
 */
function login(username, password,callback){
    callback(true);
}
function register(username, password,callback){
    callback(true);
}
function saveGameInfo(roomNum,username, date ,no,grade){

}
function getTotalInfo(username, callback){
    callback([{roomNum:0,no:1,date:'2015/1/16',grade:15},{roomNum:0,no:3,date:'2015/1/13',grade:15},{roomNum:1,no:1,date:'2015/1/16',grade:17},{roomNum:2,no:1,date:'2015/1/16',grade:3}]);
}

exports.login = login;
exports.register = register;
exports.saveGameInfo = saveGameInfo;
exports.getTotalInfo = getTotalInfo;