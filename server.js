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
let Post = require('./models/posts');
let Site = require('./models/sites');
let SubjectIds = require('./models/subjectIds');
let Subject = require('./models/subjects');

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

/**************** arrays for random ******************/
let ints = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
let chars = [];
for(let i = 0;i < 26; i++) {
    chars.push(String.fromCharCode('a'.charCodeAt(0) + i))
}
/***************************************/

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

//sign up
app.get('/api/signUp',function (req,res) {
    console.log('signUp', req.query.user);
    mongoose.connect(DB_CONN_STR);
    /*********** do some staff ***************/
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

function getId(part) {
    let id = '';
    for(let i = 0; i < 10; i++) {
        let random = Math.random() * 2;
        if(random < 1) {
            let ranInt = parseInt(Math.random() * 11);
            id += ints[ranInt];
            continue;
        }else {
            let ranChar = parseInt(Math.random() * 27);
            id += chars[ranChar];
        }
    }
    return part + id;
}
console.log('getId', getId('test'));
//add post
app.post('/api/addPost',function (req, res) {
    let postId = getId('post');//get an id for this post
    console.log('addPost', postId, req.body.userName, req.body.title, req.body.mainText);
    mongoose.connect(DB_CONN_STR);
    let PostEntity = new Post({
        id : postId,
        userName  : req.body.userName,
        title: req.body.title,
        mainText: req.body.mainText,
        responses: []
    });
    PostEntity.save(function(error,doc){
        if(error){
            console.log("error :" + error);
        }else{
            console.log('PostEntitySave', doc);
            User.update({user: req.body.userName}, {"$push": {'posts': {"id": postId}}}, function (error, docs) {
                if (error) {
                    console.log("error :" + error);
                } else {
                    console.log('User', docs); //
                    db.close();
                    res.json({
                        "postId" : postId,
                    });
                }
            });

        }
    });

});

//send subject messages when site open
app.get('/api/getSucjectsWithYear', function (req, res) {
   console.log('getSucjectsWithYear', req.query.year);
   mongoose.connect(DB_CONN_STR);
    /************* staff *****************/
    let year = req.query.year;
    let resData = {
        year: year,
        subjects: [],
    };
    SubjectIds.findOne({ "year": year }, function (err, doc) {
        if(err){
            console.log('getSucjectsWithYear:SubjectIds:error', err);
        }else{
            console.log('SubjectIds', doc);
            let subjectIds = doc.subjectIds;
            let len = subjectIds.length;
            for(let i = 0; i < len; i++) {
                Subject.findOne({"id": subjectIds[i].id}, function (err, doc) {
                    if(err) {
                        console.log('getSucjectsWithYear:subject:error', err);
                    }else{
                        console.log('subject', doc);
                        let sites = doc.copyRights;
                        let siteLen = sites.length;
                        let copyRights = [];
                        for(let j = 0; j < siteLen; j++){
                            Site.find({"id": sites[j].id}, function (err, doc) {
                                if(err){
                                    console.log('getSucjectsWithYear:Site:error', err);
                                }else {
                                    console.log('site', doc);
                                    copyRights.push(doc);
                                    if(i == len -1 && j == siteLen - 1) {
                                        setTimeout(function () {
                                            db.close();
                                            res.json(resData);
                                        }, 10);
                                    }
                                }
                            });
                        }
                        //TODO:setTimeOut is just a compromise, must be change to 连表查询
                        // setTimeout(function () {
                            doc.copyRights = copyRights;
                            resData.subjects.push(doc);
                        // }, 4);

                    }
                })
            }

        }
    });
});
//add subject clickNum
app.get('/api/subjectClicked', function (req, res) {
   console.log('subjectClicked', req.query.subjectId);
   mongoose.connect(DB_CONN_STR);
/************* staff *********************/
    let id = req.query.subjectId;
    Subject.findOne({"id": id}, function (err, doc) {
        if(err){
            console.log('subjectClicked:error', err);
        }else{
            doc.clickNum++;
            doc.save(function (err) {
                if(err){
                    console.log('subjectClicked:saveError', err)
                }else {
                    console.log('add success');
                    res.json({
                        "msg_id": "1"
                    })
                }
            })
        }
    })
});

app.get('/api/commentAdded', function (req, res) {
   console.log('/api/commentAdded', req.query.subjectId);
   mongoose.connect(DB_CONN_STR);
/*********************************************/
    let id = req.query.subjectId;
    Subject.findOne({"id": id}, function (err, doc) {
        if(err){
            console.log("/api/commentAdded:error", err);
        }else {
            doc.commentNum++;
            doc.save(function (err) {
                if(err) {
                    console.log('/api/commentAdded:addError', err);
                    res.json({
                        "msg_id": "0"
                    });
                    // return
                }else {
                    console.log('add success');
                    res.json({
                        "msg_id": '1'
                    });
                    // return
                }
            })
        }
    })
});
































