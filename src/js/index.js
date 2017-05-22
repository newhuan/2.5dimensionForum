/**
 * Created by huhanwen on 2017/3/19.
 */

// let $signIn = $('#sign-in');
// let $signUp = $('#sign-up');
const root = "http://localhost:3000/";
let $subjectList = $('.subject-list');
let $responses = $('.response');
let $subjectTemplete = $('#subject-templete')[0];
let subjectTemplete = $subjectTemplete.innerHTML;
let year = '2017';

// $subjectList.delegate('.title', 'click')

$('window').ready(function () {
    isLogin(function (msg_id) {
        if(msg_id == -1) {

        }else if (msg_id == 1) {
            let user = localStorage.getItem('dem2p5_user');
            let password = localStorage.getItem('dem2p5_pwd');
            let type = localStorage.getItem('dem2p5_type');
            setSignIn(user, password, type);
        } else {

        }

    });

   // console.log('123')
    $.ajax({
        type : 'get',
        url : '/api/getSucjectsWithYear',
        data : {
            "year" : year
        },
        success : function (res) {
            console.log('getSucjectsWithYear', res);
            let subjects = res.res.subjects;
            showSubject(subjects);
        }
    });

//    sign in up out models
    let $signs = $('.sign');
    let $models = $('.model');
    let $close = $('.close');
    let $modelLayout = $('.model-layout');
    $close.on('click', function () {
       $modelLayout.hide();
    });

    $signs.on('click', function () {
        if(!$(this).hasClass('active')){
            $signs.toggleClass('active');
            $models.toggle();
        }else {

        }
    });

    //sign in up out button
    let $signIn = $('#sign-in');
    let $signUp = $('#sign-up');
    let $signOut = $('#sign-out');

    $signIn.on('click', function () {
        $modelLayout.show();
        $('.sign-in-tab').click();
    });

    $signUp.on('click', function () {
        $('.sign-up-tab').click();
        $modelLayout.show();
    });

    $signOut.on('click', function () {

        setSignOut();
    });

    //sign in & sign up submit
    let $signInSubmit = $('#sign-in-submit');
    let $signUpSubmit = $('#sign-up-submit');

    $signInSubmit.on('click', function () {
        let user = $('#user-up').val(),
            password = $('#pwd-up').val(),
            type = $('.user-type:checked').val();

        let signInPromise = new Promise(function (resolve, reject) {
            $.ajax({
                    type : 'get',
                    url : '/api/signIn',
                    data : {
                        user,
                        password,
                        type
                    },
                    success : function (res) {
                        console.log(res);
                        resolve(res, type);
                    },
                    error: function (e) {
                        reject(e);
                    }
            });
        });

        signInPromise.then(function (res) {
            console.log('then',res.msg_id);//0 1 2
            if(res.msg_id == 1){
                setSignIn(user, password, type);
                $close.click();
            }else if(res.msg_id == 0){
                alert('密码错误，请重新输入！');
            }else {
                alert('不存在此用户，请重新输入！');
            }

        }).catch(function (err) {
            console.log('catch', err);

        })
    });

    $signUpSubmit.on('click', function () {
        console.log('as');
        let user, password, repwd;
        user = $('#user-in').val();
        password = $('#pwd-in').val();
        repwd = $('#rePwd-in').val();
        if(!checkEmpty(user, password, repwd)){
            alert("请填写完整!");
            return;
        }

        if(password!== repwd){
            alert("两次密码输入不一致，请重新输入！");
        }
        if(!regPwd.test(password)||/^\d{8,16}$/.test(password)){
            alert("密码非法，请重新输入！");
            return;
        }

        signUp(user,password).then(function (res) {
            if(res.msg_id === "4"){
                alert("此用户已存在，请重新输入用户名！");
                return;
            }
           if(res.msg_id !== "1"){
               alert("注册失败，请稍后重试！");
           }else {
               alert("注册成功！");
               $('.close').click();
           }

        });
    });


    //ready end
});
//ce shi git
let $userName = $('#user-name');
let $signOut = $('#sign-out');
//sign in up out button
let $signIn = $('#sign-in');
let $signUp = $('#sign-up');

function setSignIn(user, password, type) {
    setLocalStorageSignIn(user, password, type);
    $signIn.hide();
    $signUp.hide();
    $userName.html(user);
    $userName.show();
    $signOut.show();
}

function setSignOut() {
    setLocalStorageSignOut();
    $userName.html(' ');
    $userName.hide();
    $signOut.hide();
    $signIn.show();
    $signUp.show();
}

function signUp(user, password) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type:'post',
            url: root + "api/signUp",
            data: {
                user,
                password
            },
            success: function (res) {
                resolve(res);
            },
            error: function (e) {
                reject(e);
            }
        })
    })
}


let $2017 = $('#year-2017');
$2017.on('click', function () {
    console.log('2017-clicked');
    $.ajax({
        type : 'get',
        url : '/api/getSucjectsWithYear',
        data : {
            "year" : "2017"
        },
        success : function (res) {
            console.log('getSucjectsWithYear', res, $subjectTemplete.innerHTML);
            let subjects = res.subjects;
        }
    })
});

$subjectList.delegate('li', 'click', function (e) {
   let evt = e || window.event;
   let id = $(this).attr("subjectid");
   console.log('click:id', id);
   $.ajax({
       type: "get",
       url: "/api/subjectClicked",
       data: {
           subjectId: id
       },
       success: function (res) {
           console.log('res', res);
       }
   });
    evt.stopPropagation();
});

function showSubject(subjects) {
    for(let i = 0, len = subjects.length; i < len; i++) {
        if(subjects[i] === null) {
            continue;
        }
        let temp = subjectTemplete;
        temp = temp.replace(/\{\{subName\}\}/g, subjects[i].subName);
        temp = temp.replace(/\{\{clickNum\}\}/g, subjects[i].clickNum);
        temp = temp.replace(/\{\{commentNum\}\}/g, subjects[i].commentNum);
        temp = temp.replace(/\{\{id\}\}/g, subjects[i].id);
        // console.log(temp)
        let $subject = $(temp);
        // console.log($subject);
        $('.subject-list').append($subject);
    }
}














