/**
 * Created by huhanwen on 2017/5/9.
 */
let regPwd = new RegExp('^[!"#$%&\'\(\)*+,-./0-9:;<=>?@A-Z[\\]^_`a-z{|}~]{8,16}$');

$('window').ready(function () {
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
            return;
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


});
function setSignIn(user, password, type) {
    setLocalStorageSignIn(user, password, type);
    showUserName();
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