/**
 * Created by huhanwen on 2017/5/2.
 */
//nodejs modules
let fs = require('fs');
let path = require('path');

//modules from npm install
let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('./mongoose');
let multer  = require('multer');
// let upload = multer({ dest: './assests/imgs' });

let createFolder = function(folder){
    try{
        fs.accessSync(folder);
    }catch(e){
        fs.mkdirSync(folder);
    }
};

let uploadFolder = './src/assets/imgs/';

createFolder(uploadFolder);

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        cb(null, file.fieldname + '-' + Date.now()+'.jpg');
    }
});
let upload = multer({ storage: storage });

mongoose.set('debug', true);
const pageNum = '20';
const DB_CONN_STR = 'mongodb://localhost:27017/bishe';

mongoose.connect(DB_CONN_STR);

/************************model***************/
let User = require('./models/user');
let Admin = require('./models/admin');
let Post = require('./models/posts');
let Site = require('./models/sites');
let SubjectIds = require('./models/subjectIds');
let Subject = require('./models/subjects');
let Response = require('./models/responses');
let clickRanking = require('./models/clickRankings');
let commentRanking = require('./models/commentRankings');
let Operation = require('./models/operation');
let Jurisdiction = require('./models/jurisdiction');
let Type = require('./models/type');
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
let connId = setInterval(function () {
    db.close();
    setTimeout(function () {
        mongoose.connect(DB_CONN_STR);
    }, 2);

}, 1000 * 200);
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
    //re5.2.s.setHeader('Access-Control-Allow-Origin', '*');

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

//sign up 注册
app.post('/api/signUp',function (req,res) {
    console.log('signUp');
    //mongoose.connect(DB_CONN_STR);
    /*********** do some staff ***************/
    User.find({user: req.body.user}, function (error, docs) {
        if(error) {
            console.log("error :" + error);
        } else {
            console.log(docs); //
            if(docs.length !== 0){
                res.json({
                    msg_id : '4',
                    message : 'repeat username'
                });
                // return;
            }else{
                let time = getTime();
                let UserEntity = new User({
                    user : req.body.user,
                    password  : req.body.password,
                    responses: [],
                    posts: [],
                    photo: "",
                    tel: "",
                    address: "",
                    email: "",
                    createTime: time,
                    lastUpdateTime: time
                });
                // console.log('TestEntity::',UserEntity.user);
                UserEntity.save(function(error,doc){
                    if(error){
                        console.log("error :" + error);
                    }else{
                        console.log(doc);
                        //db.close();
                        res.json({
                            "msg_id" : '1',
                        });
                    }
                });

            }
        }
    });

    /**************************/
    //db.close();
    // console.log()

});

//sign  登录
app.get('/api/signIn', function (req,res) {
    console.log('signIn', req.query.user, req.query.type);
    //mongoose.connect(DB_CONN_STR);
    /*********** do some staff ***************/
    let type = req.query.type;
    let user = req.query.user;
    let Model = type == 0 ? User : Admin;
    let condition = type == 0 ? {
        user : user
        } : {
        adminUser : user
    };
    Model.find(condition, function (error, docs) {
        if(error) {
            console.log("error :" + error);
        } else {
            console.log(docs); //
            if(docs.length == 0) {
                res.json({
                    "msg_id" : 2,
                    "msg": "user not exist"
                });
                return;
            }
            console.log('psd::',docs[0].password,req.query.password);
            let msg_id = docs[0].password == req.query.password ? 1 : 0;

            res.json({
                "msg_id" : msg_id,
            });
        }
    });
    /**************************/
    // return;
});

//search user
app.get('/api/searchUser', function (req, res) {
    console.log('api/searchUser');
    //mongoose.connect(DB_CONN_STR);
    /*********** do some staff ***************/
    let userName = req.query.userName;
    let jurisdiction = req.query.jurisdiction;
    let Model,condition;
    let users = [];
    if(jurisdiction == 0){
        Model = User;
        condition = {
            user: userName
        }
    }else if (jurisdiction == 1){
        Model = Admin;
        condition = {
            adminUser: {$exists: true}
        }
    }
    Model.find(condition, function (err, doc) {
       if(err){
           res.json({
               "msg_id": -1,
               "msg": "search user fail, database error"
           })
       } else {
           // let key = Model === User ? "user" : "adminUser";
           // console.log(key, doc);
           // for(let i = 0, len = doc.length; i < len; i++) {
           //     if(doc[i][key].indexOf(userName) >= 0) {
           //         users.push(doc[i]);
           //     }
           //     if(i === len - 1) {
                   res.json({
                       state: 1,
                       res: doc
                   });
               // }
           // }
       }
    });
});

app.post('/api/deleteUser', function (req, res) {
    console.log('api/deleteUser');
    //mongoose.connect(DB_CONN_STR);
    /*********** do some staff ***************/
    let user = req.body.userName;
    let jurisdiction = req.body.jurisdiction;
    console.log(jurisdiction,user);
    if(jurisdiction == 0) {
        User.remove({user: user}, function (err) {
            if(err) {
                console.log('delete user error', err);
                res.json({
                    state: 0,
                    msg: "delete user fail"
                });
                //db.close();
            }else {
                res.json({
                    state:1,
                    msg: "delete user success"
                });
                //db.close();
            }
        });
    }else {
        Admin.remove({adminUser: user}, function (err) {
            if(err) {
                console.log('delete user error', err);
                res.json({
                    state: 0,
                    msg: "delete user fail"
                });
                //db.close();
            }else {
                res.json({
                    state:1,
                    msg: "delete user success"
                });
                //db.close();
            }
        });
    }
});

function userExist(Model, condition) {
    Model.find(condition, function (err, doc) {
        if(err) {
            return true
        }else {
            return doc!==null;
        }
    })
}

app.post('/api/changeUserJurisdiction', function (req, res) {
   let user = req.body.user,
       jurisdiction = req.body.jurisdiction,
       jurisdictionBefore = req.body.jurisdictionBefore;
   console.log("api/changeUserJurisdiction", jurisdiction,jurisdictionBefore, user);
   if(jurisdiction === jurisdictionBefore){
       res.json({
           "msg_id":1,
           "msg":"nothing changed"
       });
       return;
   }
   let condition1 = {};
   let condition2 = {};
   let model1,model2;
   //conditions
   if(jurisdiction == 0){
       //delete from admin
       //add into user
       model1 = Admin;
       condition1 = {
           adminUser:user
       };
       if(jurisdictionBefore == 1){
           model2 = User;
           condition2 = {
               user
           };
       }
   }else if(jurisdiction == 1) {
       model1 = User;
       condition1 = {
           user
       };
       if(jurisdictionBefore == 0) {
           model2 = Admin;
           condition2 = {
               adminUser:user
           }
       }
   }
//   stuff
    let data;
    model1.findOne(condition1, function (err, doc) {
        if(err) {
            res.json({
                "msg_id": -1,
                "msg": "change jurisdiction fail, database error"
            });
        }else {
            if(doc === null) {
                res.json({
                    msg_id: -2,
                    msg: "invalid user"
                });
            }else {
                data = doc;
                model1.remove(condition1, function (err) {
                    if(err){
                        res.json({
                            "msg_id": -1,
                            "msg": "change jurisdiction fail, database error"
                        });
                    }else {
                    //    add in model2
                        let time = getTime();
                        let entity = {
                            password  : data.password,
                            responses: data.response,
                            posts: data.posts,
                            photo: data.photo,
                            tel: data.tel,
                            address: data.address,
                            email: data.email,
                            createTime: time,
                            lastUpdateTime: time
                        };
                        if(model2 === User){
                            entity.user = data.adminUser;
                        }else if(model2 === Admin) {
                            entity.adminUser = data.user;
                            entity.jurisdiction = 9;
                        }
                        console.log(entity);
                        let model2Entity = new model2(entity);
                        model2Entity.save(function (err) {
                            if(err){
                                res.json({
                                    "msg_id": -1,
                                    "msg": "change jurisdiction fail, database error"
                                })
                            }else {
                                res.json({
                                    "msg_id":1,
                                    "msg": "change jurisdiction successful!"
                                })
                            }
                        })
                    }
                })
            }
        }
    })

});

//Sites
app.post('/api/addSites', function (req, res) {
   console.log('/api/addSites');
   let id = getId('site');
   let time = getTime();
   let domainName = req.body.domainName;
   let name = req.body.name;
   let SiteEntity = new Site({
       id,
       domainName,
       name,
       createTime: time,
       lastUpdateTime: time
   });
   SiteEntity.save(function (err, doc) {
       if(err) {
           console.log('add site error', err);
           res.json({
               state: 0,
               msg: "add site fail"
           });
       }else {
           res.json({
               state: 1,
               msg: "add site successful"
           });
       }
   })

});

function ifSiteIdValid(siteId) {
    return siteId.length === 14 || siteId==="copyRightId";
}

app.get('/api/getAllSites', function (req, res) {
    console.log('/api/getAllSites');
    //mongoose.connect(DB_CONN_STR);
    /*********** do some staff ***************/
    Site.find({name: {$exists: true}}, function (err, doc) {
        if(err) {
            console.log('get sitesError', err);
            res.json({
                state:0,
                msg: "get sites fail"
            });
        }else {
            res.json({
                state: 1,
                res: doc
            })
        }
        //db.close();
    })
});

app.get('/api/getSiteByName', function (req, res) {
   let name = req.query.name;
   console.log('api/getSiteByName', name);
   Site.findOne({name}, function (err, doc) {
       if(err) {
           res.json({
               "msg_id": -1,
               "msg":"get site error, database error!"
           });
       }else {
           res.json({
               "msg_id":1,
                site:doc
           });
       }
   })
});

app.get('/api/getSites', function (req, res) {
    console.log('/api/getSites');
    //mongoose.connect(DB_CONN_STR);
    /*********** do some staff ***************/
    let sites = req.query.sites;
    let sitesRes = [];
    for(let i = 0, len = sites.length; i < len; i++) {
        if(!sites[i]) {
            continue;
        }
        Site.findOne({id: sites[i]}, function (err, doc) {
            if(err) {
                console.log('get sitesError', err);
                res.json({
                    state:0,
                    msg: "get sites fail"
                });
                //db.close();
            }else {
                sitesRes.push(doc);
                if(i == len - 1) {
                    res.json( {
                        state: 1,
                        res: sitesRes
                    });
                    // //db.close();
                }
            }

        })
    }

});

app.post('/api/updateSite', function (req, res) {
   let id = req.body.id;
   let name = req.body.name;
   let domainName = req.body.domainName;
   console.log('api/updateSite',name);
   if(ifSiteIdValid(id)) {
        res.json({
            "msg_id": -2,
            "msg": "update site fail, invalid siteId"
        });
        return;
   }
   Site.findOne({id}, function (err, doc) {
       if(err) {
           res.json({
               "msg_id":-1,
               "msg":"update site error, database error"
           });
       }else {
           doc.name = name;
           doc.domainName = domainName;
           doc.save(function (err) {
               if(err) {
                   res.json({
                       "msg_id":-1,
                       "msg": "update site fail, database error"
                   });
               }else {
                   res.json({
                       "msg_id":1,
                       "msg":"update site succsee"
                   })
               }
           })
       }
   })
});

app.post('/api/deleteSite', function (req, res) {
    let id = req.body.id;
    console.log('api/deleteSite', id);
    if(!ifSiteIdValid(id)){
        res.json({
            "msg_id": -2,
            "msg":"delete site faid, invalid siteId"
        });
        return;
    }
    Site.remove({id}, function (err) {
        if(err){
            res.json({
                "msg_id":-1,
                "msg":"delete site fail, database error"
            });
        }else {
            res.json({
                "msg_id": 1,
                "msg": "delete site success!"
            })
        }
    })
});

function getId(part) {
    let id = '';
    for(let i = 0; i < 10; i++) {
        let random = Math.random() * 2;
        if(random < 1) {
            let ranInt = parseInt(Math.random() * 10);
            id += ints[ranInt];
        }else {
            let ranChar = parseInt(Math.random() * 26);
            id += chars[ranChar];
        }
    }
    return part + id;
}

function getTime() {
    let date = new Date();
    return date.getTime();
}

//add post
app.post('/api/addPost',function (req, res) {
    let postId = getId('post');//get an id for this post
    console.log('addPost', postId, req.body.userName, req.body.title, req.body.mainText);
    //mongoose.connect(DB_CONN_STR);
    let title =  req.body.title;
    let time = getTime();
    let PostEntity = new Post({
        id : postId,
        userName  : req.body.userName,
        title: title,
        mainText: req.body.mainText,
        responses: [],
        createTime: time,
        lastUpdateTime: time
    });
    PostEntity.save(function(error,doc){
        if(error){
            res.json({
                "msg_id":-1,
                "msg": "database error"
            })
            // console.log("error :" + error);
        }else{
            // console.log('PostEntitySave', doc);
            User.update({user: req.body.userName}, {"$push": {'posts': {"id": postId,"title": title}}}, function (error, docs) {
                if (error) {
                    // console.log("error :" + error);
                    res.json({
                        "msg_id":-1,
                        "msg": "database error"
                    })
                } else {
                    // console.log('User', docs); //
                    Subject.findOne({id: req.body.subjectId}, function (err, doc) {
                       if(err){
                           res.json({
                               "msg_id":-1,
                               "msg": "database error"
                           })
                       } else {
                           doc.postList.push({
                               id: postId
                           });
                           doc.commentNum++;
                           doc.save(function (err) {
                               if(err){
                                   res.json({
                                       "msg_id":-1,
                                       "msg": "database error"
                                   })
                               }else {
                                   res.json({
                                       "postId" : postId,
                                   });
                               }
                           })
                       }
                    });
                    // Subject.update({id: req.body.subjectId}, {"$push": {'postList': {"id": postId}}}, function (err, docs) {
                    //     if(err) {
                    //         console.log("error :" + error);
                    //     } else {
                    //         console.log('subject', docs);
                    //         //db.close();
                    //
                    //     }
                    // });

                }
            });

        }
    });

});

//add response
app.post('/api/addResponse', function (req, res) {
    let responseId = getId('response');//get an id for this post
    console.log('addResponse', responseId, req.body.userName, req.body.postId, req.body.mainText);
    //mongoose.connect(DB_CONN_STR);
    let time = getTime();
    let subjectId = req.body.subjectId;
    let ResponseEntity = new Response({
        id : responseId,
        user  : req.body.userName,
        text: req.body.mainText,
        createTime: time,
        lastUpdateTime: time
    });
    ResponseEntity.save(function(error,doc){
        if(error){
            // console.log("error :" + error);
            res.json({
                "msg_id":-1,
                "msg": "database error"
            })
        }else{
            // console.log('ResponseEntitySave', doc);
            User.update({user: req.body.userName}, {"$push": {'responses': {"id": responseId}}}, function (error, docs) {
                if (error) {
                    // console.log("error :" + error);
                    res.json({
                        "msg_id":-1,
                        "msg": "database error"
                    })
                } else {
                    // console.log('User', docs); //
                    Post.update({id: req.body.postId}, {"$push": {'responses': {"id": responseId}}}, function (err, docs) {
                        if(err) {
                            res.json({
                                "msg_id":-1,
                                "msg": "database error"
                            })
                        } else {
                            addCommentNum(subjectId, 1).then(function () {
                                res.json({
                                    "responseId" : responseId,
                                });

                            }).catch(function (err) {
                                res.json({
                                    "msg_id":-1,
                                    "msg": "database error"
                                })
                            })
                        }
                    });

                }
            });

        }
    });
});

function addCommentNum(subjectId, num) {
    return new Promise(function (resolve, reject) {
        Subject.findOne({id: subjectId}, function (err, doc) {
            if(err){
                reject(err);
            }else{
                doc.commentNum =  parseInt(doc.commentNum) + num;
                doc.save(function (err) {
                    if(err){
                        reject(err);
                    }else {
                        resolve();
                    }
                })
            }

        })
    })
}

//add subject
app.post('/api/addSubject', upload.single('upload_img'), function (req, res) {
    let subjectId = getId('subject');//get an id for this post
    // console.log('WithImg', req.file.destination+req.file.filename);
    let urlList;
    if(!req.file){
        urlList = [];
    }else{
        let url = req.file.destination+req.file.filename;
        url = "http://localhost:3000" + url.slice(1);
        url = url.replace("/src","");
        urlList = [url];
    }
    console.log('addSubject', subjectId, req.body.subName, req.body.abstract, req.body.year);
    let subName = req.body.subName;
    let abstract = req.body.abstract;
    let year = req.body.year;
    let sites = req.body.sites.split(',');
    let type = req.body.type;
    let video = req.body.video;
    let comment = req.body.comment;
    let time = getTime();
    console.log(sites,type);
    //mongoose.connect(DB_CONN_STR);
    let commentRankingEntity = new commentRanking({
        ranking:0,
        subjectId: subjectId,
        subName: subName,
        commentNum: 0,
        createTime: time,
        lastUpdateTime: time
    });
    commentRankingEntity.save(function (err) {
        if(err) {
            console.log("error :" + error);
            res.json({
                state: 0,
                msg: "subject add fail"
            });
            //db.close();
        }
    });
    let clickRankingEntity = new clickRanking({
        ranking:0,
        subjectId: subjectId,
        subName: subName,
        clickNum: 0,
        createTime: time,
        lastUpdateTime: time
    });
    clickRankingEntity.save(function (err) {
        if(err) {
            console.log("error :" + error);
            res.json({
                state: 0,
                msg: "subject add fail"
            });
            //db.close();
        }
    });

    let SubjectEntity = new Subject({
        id : subjectId,
        picUrls: urlList,
        subName  : subName,
        abstract: abstract,
        year,
        type,
        video,
        comment,
        copyRights: sites,
        clickNum: 0,
        commentNum: 0,
        postList: [],
        createTime: time,
        lastUpdateTime: time
    });
    SubjectEntity.save(function(error,doc){
        if(error){
            console.log("error :" + error);
            res.json({
                state: 0,
                msg: "subject add fail"
            })
        }else{
            console.log(year);
            SubjectIds.findOne({"year": year}, function (err, doc) {
                doc.subjectIds.push({
                    id:subjectId
                });
                doc.save(function (err,doc) {
                    if(err) {
                        console.log(err);
                        res.json({
                            state: 0,
                            msg: "subject add fail"
                        })
                    }else {
                        console.log(doc);
                        Type.findOne({"type": type}, function (err, doc) {
                   if(err){
                       res.json({
                           "state":-1,
                           "msg":"database error"
                       })
                   }         else{
                       console.log("type", doc);
                       doc.subjectIds.push({
                           id:subjectId
                       });
                       doc.save(function (err, doc) {
                           if(err){
                               res.json({
                                   "state":-1,
                                   "msg":"database error"
                               })
                           }else {
                               res.json({
                                   state: 1,
                                   msg: "subject add successful!"
                               })
                           }
                       })
                   }
                        });
                    }
                });

            });
        }

    });
});

//send subject messages when site open
//年份 all
app.get('/api/getSucjectsWithYear', function (req, res) {
    console.log('getSucjectsWithYear', req.query.year);
    //mongoose.connect(DB_CONN_STR);
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
            if(doc === null){
                res.json({
                    state: 1,
                    res: resData
                });
                return;
            }
            let subjectIdObjs = doc.subjectIds;
            let subjectIds = [];
            for(let i = 0, len = subjectIdObjs.length; i < len; i++) {
                subjectIds.push(subjectIdObjs[i].id);
            }
            Subject.find({id:{$in:subjectIds}},function (err, doc) {
                if(err){
                    res.json({
                        state:0,
                        res:resData
                    });
                    return;
                }
                resData.subjects = resData.subjects.concat(doc);
                res.json({
                    state: 1,
                    res: resData
                })
            });
        }
    });
});

app.get('/api/searchSubjectWithYear', function (req, res) {
   let subName = req.query.subName;
   let year = req.query.year;
    getSubjectListWithYear(year).then(function (subjectList) {
        searchSubjectBysubNameInSubjectIdList(subName, subjectList).then(function (subjects) {
            res.json({
                "msg_id": 1,
                subjects
            })
        })
    }).catch(function (e) {
        res.json({
            "msg_id":-1,
            subjects:[]
        })
    })
});

//all all
app.get('/api/getAllSubjects', function (req, res) {
   Subject.find({id:{$exists: true}}, function (err, doc) {
       if(err){
           res.json({
               "msg_id":-1,
               "msg":"database error"
           })
       }else{
           res.json({
               "msg_id": 1,
               subjects: doc
           })
       }
   })
});

app.get('/api/searchSubjectInAllSubjects', function (req, res) {
    let subName = req.query.subName;
   Subject.find({subName:{$exists: true}}, function (err, doc) {
    if(err){
        res.json({
            "msg_id":-1,
            subjects:[]
        })
    }else {
        let subjects = [];
        for(let i = 0, len = doc.length;i< len;i++){
            if(!doc[i]){
                continue;
            }
            if(doc[i].subName.indexOf(subName) >= 0){
                subjects.push(doc[i]);
            }
        }
        res.json({
            "msg_id":1,
            subjects
        })
    }
   })
});

//all 分类
app.get('/api/getSubjectsWithTypeInAllYear', function (req, res) {
    let type = req.query.type;
    getSubjectListWithType(type).then(function (subjectList) {
        getSubjectsWithSubjectList(subjectList).then(function (subjects) {
           res.json({
               "msg_id": 1,
               subjects
           }) ;
        })
    }).catch(function (e) {
        res.json({
            "msg_id":-1,
            subjects:[]
        })
    })
});

app.get('/api/serchSubjectInWithType', function (req, res) {
   let subName = req.query.subName;
   let type = req.query.type;
    getSubjectListWithType(type).then(function (subjectList) {
        searchSubjectBysubNameInSubjectIdList(subName, subjectList).then(function (subjects) {
            res.json({
                "msg_id": 1,
                subjects
            })
        })
    }).catch(function (e) {
        res.json({
            "msg_id":-1,
            subjects:[]
        })
    })
});

//年份 分类
app.get('/api/getSucjectsWithTypeAndYear', function (req, res) {
   let year = req.query.year;
   let type = req.query.type;
   console.log(year, type);
    getSubjectListWithYearAndType(year, type).then(function (subjectList) {
        // console.log(subjectList);
        getSubjectsWithSubjectList(subjectList).then(function (subjects) {
            // console.log(subjects);
            res.json({
                "msg_id": 1,
                subjects
            });
        }).catch(function (e) {
            res.json({
                "msg_id": 0,
                subjects:[]
            });
        })
    }).catch(function (e) {
        console.log(e);
        res.json({
            "msg_id": 0,
            subjects:[]
        });
    });
});

app.get('/api/searchSubjectWitheTypeAndYear', function (req, res) {
   let subName = req.query.subName,
       type = req.query.type,
       year = req.query.year;
    getSubjectListWithYearAndType(year, type).then(function (subjectList) {
        searchSubjectBysubNameInSubjectIdList(subName, subjectList).then(function (subjects) {
            res.json({
                "msg_id": 1,
                subjects
            })
        })
    }).catch(function (e) {
        res.json({
            "msg_id":-1,
            subjects:[]
        })
    })
});

// app.get('/api/getSubjectsWithYearAndSubName', function (req, res) {
//     let year = req.query.year,
//     subName = req.query.subName;
//     getSubjectListWithYear(year).then(function (subjectList) {
//         searchSubjectBysubNameInSubjectIdList(subName, subjectList).then(function (subjects) {
//             res.json({
//                 "msg_id":1,
//                 subjects
//             })
//         })
//     }).catch(function (e) {
//         res.json({
//             "msg_id":0,
//             subjects:[]
//         })
//     })
// });

//add subject clickNum
app.get('/api/subjectClicked', function (req, res) {
    console.log('subjectClicked', req.query.subjectId);
    //mongoose.connect(DB_CONN_STR);
    /************* staff *********************/
    let id = req.query.subjectId;
    Subject.findOne({"id": id}, function (err, doc) {
        if(err){
            console.log('subjectClicked:error', err);
        }else{
            doc.clickNum++;
            doc.save(function (err) {
                if(err){
                    console.log('subjectClicked:saveError', err);
                    //db.close();
                }else {
                    console.log('add success');
                    res.json({
                        "msg_id": "1"
                    });
                    //db.close();
                }
            })
        }
    })
});

//add num of comment
app.get('/api/commentAdded', function (req, res) {
    console.log('/api/commentAdded', req.query.subjectId);
    //mongoose.connect(DB_CONN_STR);
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
                    //db.close();
                    // return
                }else {
                    console.log('add success');
                    res.json({
                        "msg_id": '1'
                    });
                    //db.close();
                    // return
                }
            })
        }
    })
});

//get subject Detail with subjectId
app.get('/api/getSubjectDetail', function (req, res) {
    console.log('/api/getSubjectDetail', req.query.subjectId);
    //mongoose.connect(DB_CONN_STR);
    /***************************************/
    let id = req.query.subjectId;
    Subject.findOne({"id": id}, function (err, doc) {
        if(err) {
            console.log('getSubjectDetail:error', err);
            res.json({
                "msg_id": "0",
                "message": "getSubjectDetailError"
            });
            //db.close();
        }else {
            res.json(doc);
            //db.close();
        }
    });
    /***************************************/
});

//update subject
app.post('/api/updateSubject', upload.single('upload_img'), function (req, res) {
   console.log('api/updateSubject',req.body.subName,req.body.year,req.body.abstract,req.body.copyRight);
    let imgState = 1;
    let urlList;
   if(!req.file){
       imgState = 0;//don't need to retrive picurl
   }else{
       let url = req.file.destination + req.file.filename;
       url = "http://localhost:3000" + url.slice(1);
       url = url.replace("/src","");
       urlList = [url];
   }

   let subName = req.body.subName,
       year = req.body.year,
       type = req.body.type,
       yearBefore = req.body.yearBefore,
       typeBefore = req.body.typeBefore,
       abstract = req.body.abstract,
       copyRights = req.body.copyRights.split(','),
       subjectId = req.body.subjectId,
       video = req.body.video,
       comment = req.body.comment;
   console.log(subjectId);
    Subject.findOne({"id": subjectId}, function (err, doc) {
        if(err){
            console.log("111", err);
            res.json({
                "msg_id": -1,
                "msg": "服务器错误!"
            });
            return;
        }
        console.log("Subject",doc);
        doc.subName = subName;
        doc.year = year;
        doc.abstract = abstract;
        doc.copyRights = copyRights;
        if(imgState){
            doc.picUrls = urlList;
        }
        doc.type = type;
        doc.video = video;
        doc.comment = comment;
        doc.save(function (err) {
            if(err){
                res.json({
                    "msg_id": -1,
                    "msg": "服务器错误!"
                });
            }else {
                SubjectIds.findOne({year}, function (err, doc) {
                    if(err) {
                        res.json({
                            "msg_id": -1,
                            "msg": "服务器错误!"
                        });
                    }else {
                        doc.subjectIds.push({
                                id: subjectId
                        });
                        doc.save(function (err) {
                            if(err){
                                res.json({
                                    "msg_id": -1,
                                    "msg": "服务器错误!"
                                });
                            }else {
                                SubjectIds.findOne({year:yearBefore}, function (err, doc) {
                                    if(err) {
                                        res.json({
                                            "msg_id": -1,
                                            "msg": "服务器错误!"
                                        });
                                    }else {
                                        doc.subjectIds.some(function (key,index) {
                                            if(key.id === subjectId) {
                                                doc.subjectIds.splice(index,1);
                                                return true;
                                            }else {
                                                return false;
                                            }
                                        });
                                        doc.save(function (err) {
                                            if(err) {
                                                res.json({
                                                    "msg_id": -1,
                                                    "msg": "服务器错误!"
                                                });
                                            }else {
                                                //remove subject from type
                                                removeSubjectFromType(subjectId, typeBefore).then(function () {
                                  addSubjectToType(subjectId, type).then(function () {
                                      res.json({
                                          "msg_id": '1',
                                          "msg": "update success!"
                                      });
                                  })                  
                                                });
                                                
                                            }
                                        });
                                    }

                                });
                            }
                        })
                    }
                })
            }
        })
    });
});

function addSubjectToType(subjectId, type) {
    return new Promise(function (resolve, reject) {
        Type.findOne({type}, function (err, doc) {
            if(err){
                reject(err);
            }else{
               doc.subjectIds.push({
                   id: subjectId
               });
               doc.save(function (err, doc) {
                   if(err){
                       reject(err);
                   }else{
                       resolve();
                   }
               })
            }
        })
    })
}

function removeSubjectFromType(subjectId, type) {
    return new Promise(function (resolve, reject) {
        Type.findOne({type}, function (err, doc) {
            if(err){
                reject(err);
            }else{
                doc.subjectIds.some(function (key,index) {
                    if(key.id === subjectId) {
                        doc.subjectIds.splice(index, 1);
                        return true;
                    }else {
                        return false;
                    }
                });
                doc.save(function (err, doc) {
                    if(err){
                        reject(err);
                    }else{
                        resolve();
                    }
                })
            }
        })
    })
}

function removeSubjectFromRanking(subjectId) {
    return new Promise(function (resolve, reject) {
        clickRanking.remove({subjectId}, function (err) {
            if(err){
                reject(err);
            }else {
                commentRanking.remove({subjectId}, function (err) {
                    if(err){
                        reject(err);
                    }else{
                        resolve();
                    }
                })
            }
        })
    })
}

function searchSubjectBysubNameInSubjectIdList(subName, subjects) {
    return new Promise(function (resolve, reject) {
        Subject.find({id:{$in:subjects}}, function (err, doc) {
    if(err){
        reject(err);
    }        else{
        let searchResult = [];
        for(let i = 0, len = doc.length; i < len; i++){
            if(!doc[i]){
                continue;
            }
            if(doc[i].subName.indexOf(subName)>=0){
                searchResult.push(doc[i]);
            }
        }
        resolve(searchResult);
    }
        })
    })
}

function getSubjectListWithType(type) {
    return new Promise(function (resolve, reject) {
        Type.findOne({type}, function (err, doc) {
            if(err){
                reject(err);
            }else {
                if(!doc){
                    resolve([]);
                }else{
                    // console.log("type",doc.subjectIds);
                    let subjects = [];
                    doc.subjectIds.forEach(function (key) {
                        subjects.push(key.id);
                    });
                    console.log(type, subjects);
                    resolve(subjects);
                }
            }
        })
    })
}

function getSubjectListWithYear(year) {
    return new Promise(function (resolve, reject) {
        SubjectIds.findOne({year}, function (err, doc) {
            if(err){
                reject(err);
            }else {
                if(!doc){
                    resolve([]);
                }else{
                    let subjects = [];
                    doc.subjectIds.forEach(function (key) {
                        subjects.push(key.id);
                    });
                    console.log(year, subjects);
                    resolve(subjects);
                }
            }
        })
    })
}

function getSubjectListWithYearAndType(year, type) {
    return new Promise(function (resolve, reject) {
        getSubjectListWithYear(year).then(function (subjectIdList1) {
            getSubjectListWithType(type).then(function (subjectIdList2) {
                let subjects = [];
                subjectIdList1.forEach(function (key) {
                   if(subjectIdList2.indexOf(key)>=0){
                       subjects.push(key);
                   }
                });
                resolve(subjects);
            })
        }).catch(function (e) {
            reject(e);
        })
    })

}

function getSubjectsWithSubjectList(subjectList) {
    return new Promise(function (resolve, reject) {
        console.log(subjectList);
        // let subjects = [];
        // subjectList.forEach(function (key) {
        //     subjects.push(key.id);
        // });
        Subject.find({id:{$in:subjectList}}, function (err, doc) {
            if(err){
                reject(err);
            }else{
                resolve(doc);
            }

        })
    })
}

//delete subject
app.post('/api/deleteSubject', function (req, res) {
    let subjectId = req.body.subjectId,
        year = req.body.year,
        type = req.body.type;
    
    console.log('api/deleteSubject', subjectId, year);
    Subject.remove({id:subjectId}, function (err) {
        if(err) {
            res.json({
                "msg_id": "-1",
                "msg":"delete error,database errot"
            })
        }else {
            SubjectIds.findOne({year}, function (err, doc) {
                if(err) {
                    res.json({
                        "msg_id": "-1",
                        "msg":"delete error,database errot"
                    });
                }else {
                    doc.subjectIds.some(function (key, index) {
                        if(key.id === subjectId) {
                            doc.subjectIds.splice(index,1);
                            return true
                        }else {
                            return false;
                        }
                    });
                    doc.save(function (err) {
                        if(err){
                            res.json({
                                "msg_id": "-1",
                                "msg":"delete error,database errot"
                            });
                        }else{
                            removeSubjectFromType(subjectId, type).then(function () {
                                removeSubjectFromRanking(subjectId).then(function () {
                                    res.json({
                                        "msg_id": "1"
                                    })
                                });
                            }).catch(function (e) {
                                res.json({
                                    "msg_id": "-1",
                                    "msg":"delete error,database errot"
                                });
                            });
                           
                        }
                    })
                }
            })
        }
    })
});

//get subject post list with subjectId and page num
//num of every page is 20=> const pageNum
app.get('/api/getPostList', function (req, res) {
    console.log('/api/getPostList', req.query.subjectId);
    //mongoose.connect(DB_CONN_STR);
    /************************************/
    let id = req.query.subjectId;
    let page = req.query.page;
    Subject.findOne({"id": id}, function (err, doc) {
        if(err){
            console.log('getPostListErrorAtGetSubject', err);
            //db.close();
        } else {
            if(doc === null){
                res.json({
                    total: 0,
                    postList:[]

                });
                return;
            }
            let list = doc.postList;

            let listNum = list.length;
            let resData = {
                total: listNum,
                postList: []
            };
            let start = (page - 1) * pageNum;
            let later = page * pageNum;
            let currentList = [];
            let end = later > listNum ? listNum : later;
            for(let i = start; i < end; i++) {
                if(!list[i]){
                    continue;
                }
                currentList.push(list[i].id);
            }

            Post.find({"id": {$in:currentList}}, function (err, doc) {
                if(err){
                    console.log('getPostListErrorAtGetPost', err);
                    res.json(resData);
                }else {
                    resData.postList.push(...Array.from(doc));
                        setTimeout(function () {
                            res.json(resData);
                        }, 0);
                }
            })
        }
    });



    /************************************/



});

//get post message with post id
app.get('/api/getPost', function (req, res) {
    console.log('/api/getPost', req.query.postId);
    // setTimeout(function () {
    //mongoose.connect(DB_CONN_STR);
    /*****************************************/
    let id = req.query.postId;
    Post.findOne({"id": id}, function (err, doc) {
        if(err) {
            console.log('api/getPost:error', err);
            res.json({
                msg_id: '0',
                message: 'get_post_message error'
            });
            //db.close();
        }else {
            res.json(doc);
            // setTimeout(function () {
            //db.close();
            // }, 20);


        }
    });
    // },20);



});

//get responseList with postId
app.get('/api/getResponseList', function (req, res) {
    console.log('/api/getResponseList', req.query.postId);
    //mongoose.connect(DB_CONN_STR);
    /*****************************************/
    let id = req.query.postId;
    let responseList = [];
    Post.findOne({"id": id}, function (err, doc) {
        if(err){
            console.log('getResponseListErrorAtGetPost', err);
            //db.close();
        } else {
            let responseIds = doc.responses;
            for(let i = 0, len = responseIds.length; i < len; i++) {
                Response.findOne({"id": responseIds[i].id}, function (err, doc) {
                    if(err) {
                        console.log('getResponseListErrorAtGetResponses', err);
                    }else {
                        responseList.push(doc);
                        if(i == len - 1) {
                            setTimeout(function () {
                                //db.close();
                                res.json(responseList);
                            }, 0)
                        }

                    }
                })
            }
        }
    });
    /*****************************************/
});

//get rankingList
app.get('/api/getRankingList', function (req, res) {
    console.log('/api/getRankingList');
    //mongoose.connect(DB_CONN_STR);
    /*****************************************************/
    let data = [[],[]];
    let rankings = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    clickRanking.find({ranking:{$in:rankings}}, function (err, doc) {
        if(err){
            console.log('getRankingListError', err);
            res.json(data)
        }else {
            data[0] = doc;
            commentRanking.find({ranking:{$in:rankings}}, function (err, doc) {
                if(err){
                    console.log('getRankingListError', err);
                    res.json(data)
                }else {
                    data[1] = doc;
                    res.json(data);
                }
            });
        }
    });
});

//delete post
app.post('/api/deletePost', function (req, res) {
    console.log('/api/deletePost');
    //mongoose.connect(DB_CONN_STR);
    /***********************************************/
    let id = req.body.postId;
    let userName = req.body.userName;
    Post.remove({"id":id}, function (err) {
        if(err){
            console.log(err);
            res.json({
                state:0,
                msg:"delete fail"
            });
            //db.close();
        }else {
            console.log('delete post successful');
            User.findOne({user:userName}, function (err, doc) {
                if(err){
                    //db.close();
                    return
                }
                for(let i = 0, len = doc.posts.length; i < len; i++) {
                    if(doc.posts[i].id == id) {
                        doc.posts.splice(i, 1);
                        break;
                    }
                }
                doc.save(function (err) {

                    if(err){
                        res.json({
                            state:0,
                            msg:"delete fail"
                        })
                    }else {
                        res.json({
                            state:1,
                            msg:"delete successful"
                        });

                    }
                    //db.close();
                })
            });

        }
    })
});

//search posts
app.get('/api/searchPosts', function (req, res) {
    console.log('/api/searchPosts');
    //mongoose.connect(DB_CONN_STR);
    /***********************************************/
    //if id is not empty search by id
    let id = req.query.id;
    if(id) {
        Post.find({id: id}, function (err, doc) {
            if(err) {
                res.json({
                    msg_id: -2,
                    msg: "database error"
                });
            }else {
                res.json({
                    msg_id: 1,
                    postList: doc
                });
                return;
            }
        })
    }

    //else search by subjectId
    let title = req.query.title;
    let userName = req.query.userName;
    let subjectId = req.query.subjectId ? req.query.subjectId : "";
    console.log(id, title, userName, subjectId);
    // let postList = [];
    let postList_1 = [];
    //new start
    if(!subjectId) {
        res.json({
            postList: [],
            msg_id: -1,
            msg: "subject not exist!"
        });
    }else {
        Subject.findOne({id:subjectId}, function (err, doc) {
            if(err) {
                console.log(err);
                res.json({
                    postList: [],
                    msg_id: -2,
                    msg: "database error!"
                });
            }else {
                if(!doc) {
                    res.json({
                        postList: [],
                        msg_id: -1,
                        msg: "subject not exist!"
                    });
                }else {
                    console.log(doc);
                    let postIdList = doc.postList;
                    let idList = [];
                    for(let i = 0, len = postIdList.length; i < len; i++) {
                        idList.push(postIdList[i].id);
                    }
                    Post.find({id: {$in: idList}}, function (err, doc) {
                        if(err) {
                            console.log(err);
                            res.json({
                                postList: [],
                                msg_id: -2,
                                msg: "database error!"
                            });
                        } else {
                            if(!title&&!userName) {
                                res.json({
                                    msg_id: 1,
                                    postList:doc
                                });
                                return;
                            }
                            for(let i = 0, len = doc.length; i < len; i++) {
                                if(title && doc[i].title.indexOf(title)>=0 || userName && doc[i].userName.indexOf(userName) >= 0){
                                    console.log(userName);
                                    postList_1.push(doc[i]);
                                    if(i == len-1) {
                                        setTimeout(function () {
                                            res.json({
                                                msg_id: 1,
                                                postList: postList_1
                                            });
                                        }, 2);
                                    }
                                }else {
                                    if(i == len-1) {
                                        setTimeout(function () {
                                            res.json({
                                                msg_id: 1,
                                                postList: postList_1
                                            });
                                        }, 2);
                                    }
                                }
                            }

                        }
                    })
                }
            }
        })

    }



    //end
    // if(userName != '') {
    //     User.find({"user":userName}, function (err, doc) {
    //         if(err) {
    //             console.log('findUserError', err);
    //             //db.close();
    //             return;
    //         }
    //         console.log("docs",doc);
    //         if(id == '' && title == "") {
    //             postList.push(doc.posts);
    //             //db.close();
    //             return
    //         }
    //         if(id != "") {
    //             for(let i = 0, len = doc.length; i < len; i++) {
    //                 //TODO:add postTitle in addPost
    //                 for(let j = 0, postLen = doc[i].posts.length; j < postLen; j++) {
    //                     console.log("id", doc[i].posts[j].id, id,doc[i].posts[j].id.indexOf(id));
    //                     if(doc[i].posts[j].id.indexOf(id) >= 0) {
    //                         postList.push({
    //                             title: doc[i].posts[j].title,
    //                             id: doc[i].posts[j].id
    //                         })
    //                     }
    //                 }
    //             }
    //         }
    //         if(title != "") {
    //             for(let i = 0, len = doc.length; i < len; i++) {
    //                 //TODO:add postTitle in addPost
    //                 for(let j = 0, postLen = doc[i].posts.length; j < postLen; j++) {
    //                     console.log(doc[i].posts[j].title);
    //                     if(!doc[i].posts[j].title){
    //                         continue;
    //                     }
    //                     if(doc[i].posts[j].title.indexOf(title) >= 0) {
    //                         postList.push({
    //                             title:doc[i].posts[j].title,
    //                             id:doc[i].posts[j].id
    //                         })
    //                     }
    //                 }
    //             }
    //         }
    //         console.log(postList);
    //         setTimeout(function () {
    //             let posts = Array.from(new Set(postList));
    //             res.json(posts);
    //         },40)
    //     })
    // }

});

// set rankings
let rankId = setInterval(function () {
    setClickRankings();
    setCommentRankings();
    // clearInterval(rankId);
}, 1000 * 60);

function setClickRankings() {
    console.log('setClickRankings');
    //mongoose.connect(DB_CONN_STR);
    Subject.find(function (err, doc) {
        if(err) {
            console.log('setClickRankingsError', err);
        } else {
            let data = [...doc];
            data.sort(function (a, b) {
                // console.log(b.clickNum, a.clickNum);
                return b.clickNum - a.clickNum
            });
            // console.log(data);
            for(let i = 0, len = data.length; i < len; i++) {
                clickRanking.findOne({"subjectId": data[i].id}, function (err, doc) {
                    if(err) {
                        console.log('setClickRankingsError_clickRanking', err, i)
                    } else {
                        // console.log(doc);
                        doc.ranking = i + 1;
                        doc.clickNum = data[i].clickNum;
                        doc.save(function (err) {
                            if(err) {
                                console.log('setClickRankingsError_clickRanking', err)
                            }
                        })
                    }
                })
            }
        }
    })
}
//set rankings
function setCommentRankings() {
    console.log('setCommentRankings');
    // //mongoose.connect(DB_CONN_STR);
    Subject.find(function (err, doc) {
        if(err) {
            console.log('setCommentRankingsError', err);
        } else {
            let data = [...doc];
            data.sort(function (a, b) {
                return b.commentNum - a.commentNum
            });
            // console.log(data);
            for(let i = 0, len = data.length; i < len; i++) {
                commentRanking.findOne({"subjectId": data[i].id}, function (err, doc) {
                    if(err) {
                        console.log('setCommentRankingsError_CommentRankings', err, i)
                    } else {
                        doc.ranking = i + 1;
                        doc.commentNum = data[i].commentNum;
                        doc.save(function (err) {
                            if(err) {
                                console.log('setCommentRankingsError_CommentRankings', err)
                            }

                        });
                        if(i == len - 1) {
                            setTimeout(function () {
                                //db.close();
                            }, 10);
                        }
                    }
                })
            }
        }
    })
}

























