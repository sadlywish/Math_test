/**
 * Created by user on 2014/12/20.
 */
var myModule = require('../src/test5m-2.js');
var fileList =new Array();
myModule.ls('../test/testData','js',function(err, data){
    if(err)
        throw err;
    fileList = data;
});
var virtyList = new Array();
virtyList.push("1.js");
virtyList.push('2.js');
var count=0;
console.log(fileList.length);
for(i=0;i<fileList.length;i++){
    console.log(fileList[i]);
    for(j =0;j<virtyList.length;j++){
        if(fileList[i]==virtyList[j]){
            count++;
            break;
        }
    }
}
if(count>=2){
    console.log("pass");
}else{
    throw 'not right file list :test5m-2.js'
}
