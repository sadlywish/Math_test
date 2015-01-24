 // mongoose 链接
var mongoose = require("mongoose");

var db = mongoose.connection;    

db.on('error',console.error);
db.once('open',function(){
    //创建模式和模型
});
mongoose.connect('mongodb://127.0.0.1:41118/Mc');
var gameInfoSchema = new mongoose.Schema
({
    roomNum  : {type : Number, default : 0},
    username : {type : String, default :''},
    date     : {type : String, default :''},
    no       : {type : Number, default : 0},
    grade    : {type : Number, default : 0}
    
});
var gameInfoModel = mongoose.model('gameInfo',gameInfoSchema);//创建schema对应的模型


var userSchema = new mongoose.Schema
({
    Username : {type : String, default : '' },
    password : {type : String,default : '' }
    
});

var userModel = mongoose.model('userModel',userSchema); //创建schema对应的模型
   



function login(username, password,callback){
    userSchema.methods.findbyusername = function(username, password,callback) {
		this.model('mongoose').find({username: username,password:password}, function(err,data){
			if(data.length>0){
				callback(true);
			}else{
				callback(false);
			}
		});
	}
}
function register(username, password,callback){
 //   验证注册名是否已经存在
    userSchema.methods.findbyusername = function(username,callback) {
		this.model('mongoose').find({username: username}, function(err,data){
			if(data.length=0){
				callback(true);
	//    注册新的用户
				var  username = new User
				({
					username: ' ',//获取的用户名
					password: ' ',//获取的密码
				});    
				username.save(function(err,username){
					if(err) return console.log(err);
					console.dir(username);
				});  
			}else{
				callback(false);
			}
		});
	}

}
function saveGameInfo(roomNum, username, date ,no,grade)
{


	var  savegameInfo = new gameInfo({
		roomNum  : ' ',//获取下列信息
		username : ' ',
		date     : ' ',
		no       : ' ',
		grade    : ' '
	});    

	savegameInfo.save(function(err,gameInfo){
		if(err) return console.log(err);
		console.dir(gameInfo);
	});  
}


function getTotalInfo(username, callback)
{
	mongooseSchema.methods.findbyusername = function(username, callback) {
		this.model('mongoose').find({username: username}, function(err,data){
			var userList = [];
			for(i= 0;i<data.length;i++){
				userList.push({roomNum: data[i].roomNum,  date:data[i].date ,no:data[i].no,grade:data[i].grade});
			}
			callback(userList);
		});
	}
}
exports.login = login;
exports.register = register;
exports.saveGameInfo = saveGameInfo;
exports.getTotalInfo = getTotalInfo;