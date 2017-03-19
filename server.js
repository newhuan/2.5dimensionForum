/**
 * Created by huhanwen on 2017/3/19.
 */
//nodejs modules
let fs = require('fs');
let path = require('path');

//modules from npm install
let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('./mongoose');

mongoose.set('debug', true);
let DB_CONN_STR = 'mongodb://localhost:27017/bishe';


/************************model***************/
let User = require('./models/user');
/***************************************/


/*****************set function for debug**********************/
let db = mongoose.connection;
db.on("error", function (error) {
    console.log("fail to connect to the database:" + error);
});
db.on("open", function () {
    console.log("connect to the database successful!");
});
db.on("close",function () {
    console.log('connection close');
});
/***************************************/

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
            });
        }
    });
    /**************************/
    db.close();
    // console.log()

});
app.get('/api/signUp',function (req,res) {
    console.log('signUp');
    mongoose.connect(DB_CONN_STR);
    /*********** do some staff ***************/
    console.log(req.query.user);
    User.find({user:req.query.user}, function (error, docs) {
        if(error) {
            console.log("error :" + error);
        } else {
            console.log(docs); //
            if(docs.length !== 0){
                res.json({
                    msg_id : '4',
                    message : 'repeat username'
                });
                return;
            }else{
                let TestEntity = new User({
                    user : req.query.user,
                    password  : req.query.password,
                    shopCar: []
                });
                console.log('TestEntity::',TestEntity.user);
                TestEntity.save(function(error,doc){
                    if(error){
                        console.log("error :" + error);
                    }else{
                        console.log(doc);
                        db.close();
                        res.json({
                            "msg_id" : '1',
                        });
                    }
                });

            }
        }
    });



    /**************************/

    // return;
});
