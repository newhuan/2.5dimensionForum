/**
 *
 * Created by huhanwen on 2017/5/1.
 */
const root = 'http://localhost:3000/';
$('window').ready(function () {

   // add subject
    let $addSubject = $('#add-subject');
    $addSubject.on('click', function () {
        let subName = $('#subject-title-add').val();
        let abstract = $('#subject-abstract').val();
        let year = $('#subject-year').val();
       if(!checkEmpty(subName,abstract,year)) {
           alert('请填写完整');
       }else {
            $.ajax({
                type:'post',
                url: root + 'api/addSubject',
                data: {
                    subName,abstract,year
                },
                success: function (res) {
                    console.log(res);
                },
                error: function (e) {
                    console.log('error', e);
                }
            })
       }
    });

   // search users
    let $userSearch = $('#user-search');
    $userSearch.on('click', function (e) {
        refreshUserList();
        let userName = $('#user-name').val();
        let jurisdiction = $('#user-jurisdiction').val();
        if(!checkEmpty(userName,jurisdiction)) {
            alert('请填写完整');
        }else {
            $.ajax({
                type:'get',
                url: root + 'api/searchUser',
                data: {
                    userName,
                    jurisdiction:jurisdiction == 'normal'?0:1
                },
                success: function (res) {
                    console.log(res);
                    showUsers(res.res);
                },
                error: function (e) {
                    console.log("error", e);
                }
            })
        }
    });

   // search posts
   let $postSearchBtn = $('#postSearch');
    $postSearchBtn.on('click', function (e) {
        refreshPostList();
        let id = $('#post-id').val();
        let title = $('#post-title').val();
        let userName = $('#post-user-name').val();
        $.ajax({
            type:'get',
            url: root+ 'api/searchPosts',
            data: {
                id, title, userName
            },
            success: function (res) {
                console.log(res);
                showPosts(res);
            },
            error: function (e) {
                console.log(e);
            }
        })
    });

//    delete post
    let $postList = $('.post-list');
    $postList.delegate('.delete-post', 'click', function (e) {
        console.log('$postDeleteBtnClicked');

        let postId = $(this).parent().find('.post-id-ipt').val();
        let userName = $(this).parent().parent().parent().find('#post-user-name').val();
        console.log(postId);
        $.ajax({
            type:'post',
            url: root+ 'api/deletePost',
            data: {
                postId,userName
            },
            success: function (res) {
                console.log(res);
                // showPosts(res);
            },
            error: function (e) {
                console.log(e);
            }
        })
    });


});
function showPosts(data) {
    let postTpl = $('#post-item-template').html();
    let $postList = $('.post-list');
    for(let i = 0, len = data.length; i < len; i++) {
        let post = postTpl.replace('{{postId}}', data[i].id);
        post = post.replace('{{postTitle}}', data[i].title);
        $postList.append($(post));
    }
}
function showUsers(data) {
    let userTpl = $('#user-item-template').html();
    let $userList = $('.user-list');
    for(let i = 0, len = data.length; i < len; i++) {
        if(!data[i].jurisdiction){
            let user = userTpl.replace('{{userName}}', data[i].user);
            user = user.replace('{{userName}}', data[i].user);
            let $user = $(user);
            $user.find('select').val('normal');
            $userList.append($user);
        }else {
            let user = userTpl.replace('{{userName}}', data[i].adminUser);
            user = user.replace('{{userName}}', data[i].user);
            let $user = $(user);
            $user.find('select').val('admin');
            $userList.append($user);
        }

    }
}
function refreshPostList() {
    $('.post-list').html('');
}
function refreshUserList() {
    $('.user-list').html('');
}
