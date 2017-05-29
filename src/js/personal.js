/**
 *
 * Created by newhuan on 2017/5/26.
 */
const root = "http://localhost:3000/";
let responseMsg = {
    responses: [],
    currentResponses: [],
    currentPage: 0,
    totalPages: 1,
    numEvPage: 5
};
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
        // sortResponses(res.userResponses)
        let sortedResponses = sortResponses(res.userResponses);
        initResponsesMsg(sortedResponses);
        initPageController();
        changeToPage(1);
        // showResponses();
    });

    let $pageController = $('#page-container');
    $pageController.delegate('.next', 'click', function () {
        // console.log(1);
       changeToPage(responseMsg.currentPage + 1);
    });
    $pageController.delegate('.num', 'click', function () {
        // console.log($(this).html());
       changeToPage($(this).html());
    });
    $pageController.delegate('.prev', 'click', function () {
       changeToPage(responseMsg.currentPage - 1);
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
            // resp.responses.forEach(function (item) {
                let tpl = $('#response-tpl').html();
                tpl = tpl.replace('{{postId}}',resp.postId);
                tpl = tpl.replace('{{postTitle}}',resp.postTitle);
                tpl = tpl.replace('{{responseText}}',resp.text);
                tpl = tpl.replace('{{user}}',resp.user);
                tpl = tpl.replace('{{time}}',formatDate(resp.createTime));

             $('#response-list').append($(tpl));
            // })

        })
    }

    function sortResponses(responses) {
        let respes = [];
        responses.forEach(function (resp) {
            resp.responses.forEach(function (item) {
                item.postId = resp.postId;
                item.postTitle = resp.postTitle;
                respes.push(item);
            })
        });
        respes.sort(function (resp1, resp2) {
            return resp2.createTime - resp1.createTime;
        });
        console.log(respes);
        return respes;
    }

    function initResponsesMsg(responses) {
        responseMsg.responses =responses;
        responseMsg.totalPages = responses.length % responseMsg.numEvPage === 0 ? parseInt(responses.length / responseMsg.numEvPage): parseInt(responses.length /  responseMsg.numEvPage) + 1;
        responseMsg.currentResponses = responseMsg.responses.slice(0, responseMsg.numEvPage);
        changeToPage(1);
    }

    function changeToPage(pageNum) {
        if(pageNum<=0||pageNum>responseMsg.totalPages||pageNum === responseMsg.currentPage){
            return;
        }
        clearPageList();
        responseMsg.currentPage = pageNum;
        responseMsg.currentResponses = responseMsg.responses.slice((pageNum - 1) * responseMsg.numEvPage, pageNum * responseMsg.numEvPage);
        showResponses(responseMsg.currentResponses);
        $('.num').removeClass('active');
        $($('.num').get(pageNum - 1)).addClass('active');
    }

    function clearPageList() {
        $('#response-list').html("");
    }

    function initPageController() {
        if(responseMsg.totalPages === 1){
            return
        }
        for(let i = 2; i <= responseMsg.totalPages; i++){
            let tpl = $('#page-tpl').html();
            tpl = tpl.replace("{{num}}", i);
            $($('.next').get(0)).before($(tpl));
        }
    }
});