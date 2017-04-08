/**
 * Created by huhanwen on 2017/4/8.
 */
function getUrlParam(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    let r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
//check if user has signed in
function isLogin(setLogin) {
    let status = localStorage.getItem('dem2p5_status');
    if(typeof setLogin != 'function') {
        return false;
    }
    if(!status){
        setLogin(false);
    }else if(status == 0) {
        setLogin(false);
    }else if(status == 1) {
        let user = localStorage.getItem('dem2p5_user');
        let pwd = localStorage.getItem('dem2p5_pwd');
        if(user&&pwd){
            $.ajax({
                type: 'get',
                url: 'http://localhost:3000/' + 'api/signIn',
                data: {
                    user:user,
                    password: pwd
                },
                success: function (res) {
                    setLogin(res.msg_id)
                },
                error: function () {
                    setLogin(false);
                }
            })
        }else {
            setLogin(false);
        }

    }
}

//login
function login(user, pwd, afterLogin) {
    if(!user || !pwd || typeof afterLogin != 'function') {
        return false
    }
    $.ajax({
        type: 'get',
        url: 'http://localhost:3000/' + 'api/signIn',
        data: {
            user:user,
            password: pwd
        },
        success: function (res) {
            if(res.msg_id) {
                localStorage.setItem('dem2p5_user', user);
                localStorage.setItem('dem2p5_pwd', pwd);
                localStorage.setItem('dem2p5_status', 1);
                afterLogin(res.msg_id);
            }else {
                afterLogin(false);
            }
        },
        error: function () {
            afterLogin(false);
        }
    })
}