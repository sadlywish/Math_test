/**
 * Created by user on 2015/1/7.
 */

function Unit(num ,rate,mutirate,maxnum){
    var muti = null;
    var nextUnit = null;
    var method = 0;
    var inti = function(){
        if(num>1) {
            method = Math.floor(Math.random()*2+1);
            nextUnit = new Unit(num-1, rate, mutirate, maxnum);
        }else{
            method = 0;
        }
//        console.log('1');
        muti = new MultiplyUnit(1,rate,mutirate,maxnum);

    };
    inti();
    this.getValue = function(){
        switch (method){
            default:
                return muti.getValue();
            case 1:
                return nextUnit.getValue() + muti.getValue();
            case 2:
                return nextUnit.getValue() - muti.getValue();
        }
    }
    this.getView = function(){
        switch (method){
            default:
                return ''+muti.getView();
            case 1:
                return ''+nextUnit.getView()+'+'+muti.getView();
            case 2:
                return ''+nextUnit.getView()+'-'+muti.getView();
        }
    }
}

function MultiplyUnit(count,rate,mutirate,maxnum){
    var number = null;
    var nextUnit = null;
    var method = 0;
    var inti = function(){
        if(Math.random() <= (0.5/count) && count <= mutirate) {
            method = Math.floor(Math.random()*2+1);
//            console.log(count);
            nextUnit = new MultiplyUnit(count+1, rate, mutirate, maxnum);
        }else{
            method = 0;
        }
        if (method != 0 && Math.random() < rate && rate !=0) {
            number = new NumUnit(new Unit(Math.ceil(count * 0.3 * Math.random() + 1), rate * 0.3, mutirate, maxnum), 1);
            for(j=0;method==2;){
                if(number.getValue()==0){
                    number = new NumUnit(new Unit(Math.ceil(count * 0.3 * Math.random() + 1), rate * 0.3, mutirate, maxnum), 1);
                }else{
                    break;
                }
            }
        } else {
            number = new NumUnit(Math.ceil(maxnum * Math.random()), 0);
        }
    }
    inti();
    this.getValue = function(){
        switch (method){
            default:
                return number.getValue();
            case 1:
                return nextUnit.getValue() * number.getValue();
            case 2:
                return nextUnit.getValue() / number.getValue();
        }
    }
    this.getView = function(){
        switch (method){
            default:
                return ''+number.getView();
            case 1:
                return ''+nextUnit.getView()+'x'+number.getView();
            case 2:
                return ''+nextUnit.getView()+'/'+number.getView();
        }
    }
}
function NumUnit(input,state1) {
    var state = 0;
    var num = 0;
    var unit = null;
    var inti = function () {
        state = state1;
        if (state == 0) {
            num = input;
        } else {
            unit = input;
        }
    }
    inti();
    this.getValue = function () {
        if (state == 0) {
            return num;
        } else {
            return unit.getValue();
        }
    }
    this.getView = function () {
        if (state == 0) {
            return '' + num;
        } else {
            return '(' + unit.getView() + ')';
        }
    }
}

var RQ = function randomQuestions(min ,max ,rate, mutirate, maxnum){
    var num = Math.random()*(max - min)+min;
    return new Unit(num,rate, mutirate,maxnum);
};


//for(i=0;i<10;i++){
//    var test = randomQuestions(2,5,0.2,3,10);
//    console.log(test.getView()+' = '+Math.round(test.getValue()*1000)/1000);
//}
exports.newQuestion = RQ;