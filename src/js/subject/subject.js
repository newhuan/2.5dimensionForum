/**
 * Created by huhanwen on 2017/4/8.
 */
const root = 'http://localhost:3000/';
$('window').ready(function () {
    let subjectId = getUrlParam('id');
    let postIdList = [];

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
        let postStr = postTpl.replace('{{userName}}', postList[i].userName);
        postStr = postStr.replace('{{postTitle}}', postList[i].title);
        postStr = postStr.replace('{{postId}}',postList[i].id);
        $postList.append($(postStr));
    }
}