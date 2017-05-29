/**
 *
 * Created by newhuan on 2017/5/26.
 */
const root = "http://localhost:3000/";
$('window').ready(function () {
//  change pwd
    let regPwd = new RegExp('^[!"#$%&\'\(\)*+,-./0-9:;<=>?@A-Z[\\]^_`a-z{|}~]{8,16}$');
    let $change = $('#change');
    $change.on('click', function () {
       let origialPwd = $('#origial-pwd').val(),
           newPwd = $('#new-pwd').val(),
           renewPwd = $('#renew-pwd').val();
        if(!checkEmpty(origialPwd, newPwd, renewPwd)){
            alert("请填写完整!");
            return;
        }
        if(newPwd!== renewPwd){
            alert("两次密码输入不一致，请重新输入！");
            return;
        }
        if(!regPwd.test(newPwd)||/^\d{8,16}$/.test(newPwd)){
            alert("密码非法，请重新输入！");
            return;
        }
        changePwd(origialPwd, newPwd).then(function (res) {
            if(res.msg_id === 2){
                alert("原密码错误，请重新输入！");
            }else if(res.msg_id===1){
                alert("修改成功！");
                $('#sign-out').click();
                window.location.href = "../index.html";
            }else if(res.msg_id === 3){
                alert("不存在此用户！");
            }
        })


    });

    $msg = $('#personal-msg');
    $msg.on('click', function () {
        getMsg().then(function (res) {
            if(res.msg_id === 1){
                showMsg(res.userMsg);
            }else{
            //    error handler
            }
        })
    });

    let $update = $('#update');
    $update.on('click', function () {
        let tel = $('#tel').val(),
            address = $('#address').val(),
            email = $('#email').val();
        changeMsg(tel, address, email).then(function (res) {
            if(res.msg_id === 1){
                alert("修改成功！");
            }else {
                alert("修改失败！");
            }
        })
    });

    getUserResponses().then(function (res) {
        console.log(res);
        showResponses(res.userResponses);
    });
    $('#sign-out').on('click', function () {
        window.location.href = "../index.html";
    });

    $('#response-list').delegate('a', 'click', function () {
        let postId = $(this).attr('id');

        $.ajax({
            type: 'get',
            url: root + "api/getSubIdByPost",
            data: {
                id: postId
            },success: function (res) {
                window.location.href = "./post/post.html?id=" + postId +"&subjectId=" + res.subId;
            }
        })

    });

    function changePwd(oldPassword, newPassword) {
        return new Promise(function (resolve, reject) {
            let userName = localStorage.getItem("dem2p5_user");
            let type = localStorage.getItem("dem2p5_type");
            $.ajax({
                type: "post",
                url: root + "api/changePassword",
                data:{
                    oldPassword,
                    newPassword,
                    userName,
                    type
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

    function changeMsg(tel, address, email) {
        return new Promise(function (resolve, reject) {
            let userName = localStorage.getItem("dem2p5_user");
            let password = localStorage.getItem('dem2p5_pwd');
            let type = localStorage.getItem("dem2p5_type");
            $.ajax({
                type: 'post',
                url: root + "api/updateUserMsg",
                data: {
                    tel,
                    address,
                    email,
                    userName,
                    type,
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

    function getMsg() {
        return new Promise(function (resolve, reject) {
            let userName = localStorage.getItem("dem2p5_user");
            let password = localStorage.getItem('dem2p5_pwd');
            let type = localStorage.getItem("dem2p5_type");
            $.ajax({
                type: "get",
                url: root + "api/getUserMsg",
                data: {
                    userName,
                    password,
                    type
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

    function showMsg(msg) {
        $('#tel').val(msg.tel ? msg.tel : "");
        $('#address').val(msg.address ? msg.address : "");
        $('#email').val(msg.email ? msg.email : "");
    }

    function getUserResponses() {
        return new Promise(function (resolve, reject) {
            let userName = localStorage.getItem("dem2p5_user");
            let password = localStorage.getItem('dem2p5_pwd');
            let type = localStorage.getItem("dem2p5_type");
            $.ajax({
                type: "get",
                url: root + "api/getUserResponses",
                data: {
                    userName,
                    password,
                    type
                },
                success: function (res) {
                    resolve(res);
                },
                error: function (e) {
                    reject(e);
                }
            })
        });

    }

    function showResponses(responses) {
        responses.forEach(function (resp) {
            resp.responses.forEach(function (item) {
                let tpl = $('#response-tpl').html();
                tpl = tpl.replace('{{postId}}',resp.postId);
                tpl = tpl.replace('{{postTitle}}',resp.postTitle);
                tpl = tpl.replace('{{responseText}}',item.text);
                tpl = tpl.replace('{{user}}',item.user);
             $('#response-list').append($(tpl));
            })

        })
    }
});