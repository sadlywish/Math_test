var express = require('express');
var myModule = require('./src/test5m-2.js');
var app = express();
module.exports = app;

var fileList =new Array();
module.exports.get('/',function(req,res){
    myModule.ls('./src','js',function(err, data){
        if(err)
            throw err;
        fileList = data;
        var string = 'START:\n'
        for(i=0 ;i<fileList.length ;i++){
            string = string+ fileList[i]+'\n';
        }
        res.end(string +'END\n');
    });
}).listen('3000');

