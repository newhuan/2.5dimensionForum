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
                    console.log(res);
                    // postIdList = data.postList;
                }
            });
        }
    });

});
