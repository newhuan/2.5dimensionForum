
/**
 * Created by huhanwen on 2017/4/8.
 */
const root = 'http://localhost:3000/';
let responseMsg = {
    responses: [],
    currentResponses: [],
    currentPage: 0,
    totalPages: 1,
    numEvPage: 5
};
$('window').ready(function () {
    console.log(getUrlParam('id'));
    let postId = getUrlParam('id');
    //init page message
    $.ajax({
        type: 'get',
        url: root + 'api/getPost',
        data: {
            postId: postId
        },
        success: function (res) {
            // let data = JSON.parse(res);
            console.log(res);
            $('title').html(res.title);
            setPostLayout(res);
            let url = root + 'api/getResponseList';
            $.ajax({
                type: 'get',
                url,
                data: {
                    postId: postId
                },
                success: function (res) {
                    console.log(res);
                    let sortedRes = sortResponse(res);
                    console.log(sortedRes);
                    initPageMsg(sortedRes);
                    initPageController();
                    changeToPage(1);
                    // setResponseList(res);
                },
                error: function () {
                    console.log('api/getResponseListError');
                }
            })
        },
        error:function () {
            document.write('404 Not Found');
        }

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

//    submit response
    let $submitBtn = $('#add-response');
    $submitBtn.on('click', function (e) {
        let status = localStorage.getItem('dem2p5_status');
        if(status === "0"){
            alert('请先登陆');
            return;
        }

        let mainText = $('#response-text').val();
        let userName = localStorage.getItem('dem2p5_user');
        let postId = getUrlParam('id');
        if(!checkEmpty(mainText, userName, postId)) {
            alert('请填写完整再提交');
            return;
        }
        let subjectId = getUrlParam('subjectId');
        $.ajax({
            type: 'post',
            url: root + 'api/addResponse',
            data: {
                userName,
                mainText,
                postId,
                subjectId
            },
            success: function (res) {
                console.log(res);
                if(res.responseId){
                    alert("回复成功！");
                    window.location.reload();
                }else{
                    alert('回复失败！');
                }
            },
            error: function (e) {
                console.log(e);
                alert('回复失败！');
            }
        })
    })
});

function setPostLayout(data) {
    let $postTitle = $('#post-title');
    let $postText = $('#main-text');
    let $userName = $("#user-name");
    $postTitle.html(data.title);
    $postText.html(data.mainText);
    $userName.html("发帖人："+data.userName);
}

function sortResponse(responseList) {
    responseList.sort(function (resp1,resp2) {
        return resp1.createTime - resp2.createTime;
    });
    return responseList;
}

function initPageMsg(responses) {
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
    setResponseList(responseMsg.currentResponses);
    $('.num').removeClass('active');
    $($('.num').get(pageNum - 1)).addClass('active');
}
function clearPageList() {
    $('.response-list').html("");
}

function setResponseList(responseList) {
    let resTpl = $('#response-tpl').html();
    let $responseList = $('.response-list');
    // responseList.sort(function (resp1,resp2) {
    //     return resp1.createTime - resp2.createTime;
    // });
    for(let i = 0, len = responseList.length;i < len; i++) {
        let resSTR = resTpl.replace('{{userName}}', responseList[i].user + "     发布于：" + formatDate(responseList[i].createTime));
        resSTR = resSTR.replace('{{text}}', responseList[i].text);
        $responseList.append($(resSTR));
    }
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

