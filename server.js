/**
 * Created by huhanwen on 2017/3/19.
 */
/**
 * Created by huhanwen on 2017/2/28.
 */
//nodejs modules
let fs = require('fs');
let path = require('path');

let mongoose = require('./mongoose');
mongoose.set('debug', true);
let DB_CONN_STR = 'mongodb://localhost:27017/bishe';
// let mongoose = require("mongoose");

/************************schema***************/
UserSchema = new mongoose.Schema({
    user: {// 真实姓名
        type: String
    },
    password: { // 密码
        type: String
    },
    shopCar: {
        type: Array
    }
}, { collection: 'user'}); // mongoose always add a 's' after the name of collection if you do not have the second param,because mongoose always want to be smart

/********************************************/


//modules from npm install
let express = require('express');
let bodyParser = require('body-parser');


let app = express();

app.set('port', (process.env.PORT || 3000));
app.use('/', express.static(path.join(__dirname, 'src')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use(function (req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    //res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    //res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.listen(app.get('port'), function () {
    console.log('Server started: http://localhost:' +   app.get('port') + '/');
});

//signIn
app.get('/api/signIn',function (req,res) {
    console.log('signIn');
    mongoose.connect(DB_CONN_STR);
    // 定义Model
    let User = mongoose.model('user', UserSchema);

    let db = mongoose.connection;
    db.on("error", function (error) {
        console.log("数据库连接失败：" + error);
    });
    db.on("open", function () {
        console.log("------数据库连接成功！------");
    });
    db.on("close",function () {
       console.log('close')
    });
    /*********** do some staff ***************/
    User.find({user:req.query.user}, function (error, docs) {
        if(error) {
            console.log("error :" + error);
        } else {
            console.log(docs); //
            console.log('psd::',docs[0].password,req.query.password);
            let msg_id = docs[0].password == req.query.password;

            res.json({
                "msg_id" : msg_id,
                // "docs" : docs
            });
        }
    });

    /**************************/
    db.close();
    // console.log()

});
app.get('/api/signUp',function (req,res) {
    console.log('signUp');
    mongoose.connect(DB_CONN_STR+ '/user');

    let db = mongoose.connection;
    db.on("error", function (error) {
        console.log("connect error：" + error);
    });
    db.on("open", function () {
        console.log("connect successful");
    });
    /*********** do some staff ***************/
    // console.log('some staff');
    console.log(req.query.user);
    let userName = req.query.user;
    User.find({}, function (error, docs) {
        if(error) {
            console.log("error :" + error);
        } else {
            console.log(docs); //
            let msg_id = docs.password === req.query.password;

            res.json({
                "msg_id" : msg_id,
                // "docs" : docs
            });
        }
    });
    let TestEntity = new User({
        name : "helloworld",
        age  : 28,
        email: "helloworld@qq.com"
    });
    TestEntity.save(function(error,doc){
        if(error){
            console.log("error :" + error);
        }else{
            console.log(doc);
        }
    });
    /**************************/
    db.close();
    // return;
});
