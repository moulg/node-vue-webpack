var express = require('express');
var app = express();
var fs = require('fs');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var HttpResult = require('./HttpResult');
var fileManger = require('./fileManager');
var crypto = require('crypto');
var databaseManger = require('./databaseManager');
var debug = require('debug');

var datasource="file";// file or mysql

// // 跨域支持
// app.all('*', (req, res, next) => {
//   const origin = req.headers.origin;
//   res.header('Access-Control-Allow-Origin', origin);
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token,sign');
//   res.header('Access-Control-Allow-Credentials', true);
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE');
//   next();
// });
//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token,sign');
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
	res.header("Content-Type", "application/json;charset=utf-8");
	fibers(function(){
		next();
	}).run();
});

app.get('/getVeryCode',bodyParser.json(),function(req,res){    
    var httpResult = new HttpResult();    
    //var telPhone = req.query.num;    
    if(!checkSign(req,res)){        
        return     
    }
    //随机一个验证码
    var codeNum = Math.floor(Math.random()*9000)+1000;
    httpResult.code = 1;
    httpResult.data = codeNum;
    res.send(httpResult); 
})
app.get('/users',bodyParser.json(),function(req,res){    
    if(!checkSign(req,res)){       
        return     
    }
    if(datasource=="file"){
        fileManger.getItemList(req,res);
    }else{
        databaseManger.getItemList(req,res);
    }
})

app.post('/addUser',bodyParser.json(),function(req,res){    
    if(!checkSign(req,res)){
        return
    } 
    if(datasource=="file"){
        fileManger.addItem(req,res);
    }else{
        databaseManger.addItem(req,res);
    }       
})

app.get('/page/:pageindex/:pagesize',function(req,res){
    if(!checkSign(req,res)){
        return
    } 
    if(datasource=="file"){
        fileManger.setPagination(req,res);
    }else{
        databaseManger.setPagination(req,res);
    }     
})

// md5加密
function checkSign(req,res){
    debug.log("IP地址:"+req.headers['host']);
    debug.log("运营商:"+req.headers['user-agent']);

    var appSecret = '!Q@W#E$R';
    var sign;
    var md5Conent
    if(req.method=='GET'){
        sign=req.headers.sign;   
        md5Conent = JSON.stringify(req.query) + "|" + appSecret;        
    }
    else{
        sign=req.body.headers.sign;
        md5Conent = JSON.stringify(req.body.params) + "|" + appSecret;        
    }
    var newSign = crypto.createHash('md5').update(md5Conent).digest('hex');
    if(sign==newSign){
        return true;
    }
    var httpResult = new HttpResult();
    httpResult.code = -3;
    httpResult.description = '身份认证失败！'; 
    res.send(httpResult);
    return false;
}

app.listen(3000);