/**
 *
 * Created by huhanwen on 2017/5/1.
 */
const root = 'http://localhost:3000/';
$('window').ready(function () {
   // search posts
   let $postSearchBtn = $('#postSearch');
    $postSearchBtn.on('click', function (e) {
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
                console.log(res)
                showPosts(res);
            },
            error: function (e) {
                console.log(e);
            }
        })
    });

//    delete post

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