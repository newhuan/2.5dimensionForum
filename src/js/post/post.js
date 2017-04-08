/**
 * Created by huhanwen on 2017/4/8.
 */
const root = 'http://localhost:3000/';

$('window').ready(function () {
    console.log(getUrlParam('id'), getUrlParam('click'), getUrlParam('comment'));
    let postId = getUrlParam('id');
    $.ajax({
        type: 'get',
        url: root + 'api/getPost',
        data: {
            postId: postId
        },
        success: function (res) {
            let data = JSON.parse(res);
            console.log(data);
        },
        error:function () {
            document.write('404 Not Found');
        }

    })

});