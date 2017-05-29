/**
 * Created by huhanwen on 2017/4/8.
 */
const root = 'http://localhost:3000/';
let search = "https://www.baidu.com/s?wd=site%3A({{domainName}}){{subName}}";
let subName;
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
            getSites(res.copyRights);
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
//     isLogin(setLogin);

//    add post
    let $submitBtn = $('#add-post');
    $submitBtn.on('click', function (e) {
        let status = localStorage.getItem('dem2p5_status');
        if(status === "0"){
            alert('请先登陆');
            return;
        }

        let mainText = $('#post-text').val();
        let userName = localStorage.getItem('dem2p5_user');
        let type = localStorage.getItem('dem2p5_type');
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
                type,
                title,
                mainText,
                subjectId
            },
            success: function (res) {
                console.log(res);
                if(res.postId){
                    alert("发帖成功！");
                    window.location.reload();
                }else{
                    alert("发帖失败！");
                }
            },
            error: function (e) {
                console.log(e);
                alert("发帖失败！");
                window.location.reload();
            }
        })
    });

//    search post
    let $searchPostBtn = $('#post-submit-search');
    $searchPostBtn.on('click', function () {
       let postTitle = $('#post-title-search').val();
       let postUser = $('#post-user-search').val();
       console.log(postUser);
       let id = "";
       let subjectId = getUrlParam("id");
       postTitle = postTitle ? postTitle : "";
       postUser = postUser ? postUser : "";
       // console.log(postTitle, postUser);
       // if(postTitle || postUser) {
           console.log('why');
           let searchPostPromise = new Promise(function (resolve, reject) {
               // resolve(1);
               $.ajax({
                   type: "get",
                   url: root + "api/searchPosts",
                   data: {
                        id,
                       title: postTitle,
                       userName: postUser,
                       subjectId
                   },
                   success: function (res) {
                       resolve(res);
                   },
                   error: function (e) {
                       reject(e);
                   }
               });
           });
           searchPostPromise.then(function (res) {
               console.log(res);
               setPostList(res.postList);
           }).catch(function (e) {
               console.log(e);
           })
       // }else{
       //     refresh();
       // }


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
    if(data.video){
        $('#pv-link').attr('href', data.video);
    }
    $subName.html(data.subName);
    $title.html(data.subName);
    $abstractText.html(data.abstract.slice(0,200)+"...");
    subName = data.subName;
    $('#year').html(data.year);
    console.log(data.year)
    $('#type').html(data.type);
    $('#other-comment').html(data.comment);
    $('#click-num').html(data.clickNum);
}

function setPostList(postList) {

    let postTpl = $('#post-tpl').html();
    let $postList = $('#post-list');
    $postList.html("");
    let sortedPostList = [];
    //- : a在b前
    //0 : 相对位置不变
    //+ : a在b后
    //1 - 2 : 升序
    postList.sort(function (post1, post2) {
       return  post2.lastUpdateTime - post1.lastUpdateTime;
    });
    for(let i = 0, len = postList.length;i < len; i++) {
        if(postList[i] === null){
            continue;
        }
        console.log("id", postList[i].id);
        let subjectId = getUrlParam('id');
        let postStr = postTpl.replace('{{userName}}', postList[i].userName + "     发布于：" + formatDate(postList[i].createTime));
        postStr = postStr.replace('{{postTitle}}', "(" + postList[i].responses.length + ")" + postList[i].title);
        postStr = postStr.replace('{{postId}}',postList[i].id);
        postStr = postStr.replace('{{subjectId}}', subjectId);
        $postList.append($(postStr));
    }
}

function setSites(data) {
    let siteTpl = $('#site-tpl').html();
    let $siteList = $('.site-list');
    for(let i = 0, len = data.length; i < len; i++) {
        if(data[i] === null){
            continue;
        }
        let site = siteTpl.replace('{{id}}', data[i].id);
        site = site.replace('{{name}}', data[i].name);
        let url = search.replace("{{domainName}}", data[i].domainName);
        url = url.replace("{{subName}}",subName);
        site = site.replace("{{url}}", url);
        $siteList.append($(site));
    }
}

function getSites(data) {
    $.ajax({
        type: 'get',
        url: root + 'api/getSites',
        data: {
            sites: data
        },
        success: function (res) {
            console.log(res);
            setSites(res.res);
        },
        error: function (e) {
            console.log('getSitesError',e);
        }
    })
}


// function setLogin(status) {
//     console.log(status);
// }

