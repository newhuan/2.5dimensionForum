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

});