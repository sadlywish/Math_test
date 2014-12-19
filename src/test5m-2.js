var ls = function (dir,suffix,callback){
	var fs = require('fs');
	var path = require('path');
	var filelist = new Array();
    console.log('start');
	buf = fs.readdir(dir,function(err,date){
		if(err){
			return callback(err);
		}
		for(i=0;i<date.length;i++){
				if(path.extname(date[i])==('.'+suffix))
				filelist.push(date[i]);
				console.log(date[i]);
		}
		callback(null,filelist);

	});
    console.log(buf);
};
exports.ls = ls;