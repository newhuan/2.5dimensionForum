/**
 * Created by huhanwen on 2017/4/8.
 */
const root = 'http://localhost:3000/';

$('window').ready(function () {
    console.log(getUrlParam('id'), getUrlParam('click'), getUrlParam('comment'));
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
                    setResponseList(res);
                },
                error: function () {
                    console.log('api/getResponseListError');
                }
            })
        },
        error:function () {
            document.write('404 Not Found');
        }

    })

});

function setPostLayout(data) {
    let $postTitle = $('#post-title');
    let $postText = $('#main-text');
    let $userName = $("#user-name");
    $postTitle.html(data.title);
    $postText.html(data.mainText);
    $userName.html(data.userName);
}

function setResponseList(responseList) {
    let resTpl = $('#response-tpl').html();
    let $responseList = $('.response-list');
    for(let i = 0, len = responseList.length;i < len; i++) {
        let resSTR = resTpl.replace('{{userName}}', responseList[i].user);
        resSTR = resSTR.replace('{{text}}', responseList[i].text);
        $responseList.append($(resSTR));
    }
}