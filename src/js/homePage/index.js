/**
 * Created by huhanwen on 2017/3/26.
 */
let $addPost = $('#add-post');
$addPost.on('click',function () {
   $.ajax({
       type : 'post',
       url : '/api/addPost',
       data : {
           "userName" : "newhuan",
           "title" : 'title-newhuan1',
           "mainText": "mainText-newhuan1",
       },
       success : function (res) {
           console.log('addPost', res);
       }
   })
});