/**
 * Created by huhanwen on 2017/4/8.
 */
const root = 'http://localhost:3000/';
$('window').ready(function () {
    let subjectId = getUrlParam('id');
    let postIdList = [];
    //init page
    $.ajax({
        type:'get',
        data:{
            subjectId: subjectId
        },
        url: root + 'api/getSubjectDetail',
        success: function (res) {
            // let data = JSON.parse(res);
            console.log(res);
            setAbstract(res);
            // postIdList = data.postList;
            $.ajax({
                type:'get',
                data:{
                    subjectId: subjectId,
                    page: 1
                },
                url: root + 'api/getPostList',
                success: function (res) {
                    // let data = JSON.parse(res);
                    //TODO:set page controller

                    console.log(res);
                    setPostList(res.postList);
                    // postIdList = data.postList;
                }
            });
        }
    });
//    init end
//    isLogin
    isLogin(setLogin);

//    add post
    let $submitBtn = $('#add-post');
    $submitBtn.on('click', function (e) {
        let status = localStorage.getItem('dem2p5_status');
        if(!status){
            alert('请先登陆');
            return;
        }

        let mainText = $('#post-text').val();
        let userName = localStorage.getItem('dem2p5_user');
        let title = $('#post-title-add').val();
        let subjectId = getUrlParam('id');
        if(!checkEmpty(mainText, userName , title, subjectId)) {
            alert('请填写完整再提交');
            return;
        }
        $.ajax({
            type: 'post',
            url: root + 'api/addPost',
            data: {
                userName,
                title,
                mainText,
                subjectId
            },
            success: function (res) {
                console.log(res);
            },
            error: function (e) {
                console.log(e);
            }
        })
    })

});
function setAbstract(data) {
    let $avatar = $('#avatar');
    let $subName = $('#subject-name');
    let $abstractText = $('#abstract');
    let $title = $('title');

    if(data.picUrls[0]){
        $avatar.attr('src', data.picUrls[0]);
    }
    $subName.html(data.subName);
    $title.html(data.subName);
    $abstractText.html(data.abstract);
}

function setPostList(postList) {
    let postTpl = $('#post-tpl').html();
    let $postList = $('#post-list');

    for(let i = 0, len = postList.length;i < len; i++) {
        console.log("id", postList[i].id);
        let postStr = postTpl.replace('{{userName}}', postList[i].userName);
        postStr = postStr.replace('{{postTitle}}', postList[i].title);
        postStr = postStr.replace('{{postId}}',postList[i].id);
        $postList.append($(postStr));
    }
}

function setLogin(status) {
    console.log(status);
}

