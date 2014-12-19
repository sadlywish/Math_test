var mymodule = require('./../src/test5m-2.js');
var fileList =new Array();
mymodule.ls('./test/testData','js',function(err,date) {
    if (err)
        throw err;
    fileList = date;
    var virtyList = new Array();
    virtyList.push("1.js");
    virtyList.push('2.js');
    var count = 0;
    console.log(fileList.length);
    for (i = 0; i < fileList.length; i++) {
        for (j = 0; j < virtyList.length; j++) {
            if (fileList[i] == virtyList[j]) {
                count++;
                break;
            }
        }
    }
    if (count >= 2) {
        console.log("pass");
    } else {
        throw 'not right file list :test5m-2.js'
    }
});