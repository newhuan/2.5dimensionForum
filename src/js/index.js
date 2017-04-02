/**
 * Created by huhanwen on 2017/3/19.
 */
$('window').on('load',function () {

});
let $signIn = $('#sign-in');
let $signUp = $('#sign-up');
let $2017 = $('#year-2017');
let $subjectList = $('.subject-container');
$signIn.on('click',function () {
   // console.log(1) ;
    $.ajax({
        type : 'get',
        url : '/api/signIn',
        data : {
            "user" : "11111111111",
            "password" : '11111aa'
        },
        success : function (res) {
            console.log(res);
        }
    });

});
$signUp.on('click',function () {
    console.log('signUp');
    $.ajax({
        type : 'get',
        url : '/api/signUp',
        data : {
            "user" : "newhuan",
            "password" : '123456'
        },
        success : function (res) {
            console.log(res.msg_id);
        }
    })
});


$2017.on('click', function () {
    console.log('2017-clicked');
    $.ajax({
        type : 'get',
        url : '/api/getSucjectsWithYear',
        data : {
            "year" : "2017"
        },
        success : function (res) {
            console.log('getSucjectsWithYear', res);
        }
    })
});

$subjectList.on('click', function (e) {
   let evt = e || window.event;
   let id = e.target.id;
   console.log('click:id', id);
   $.ajax({
       type: "get",
       url: "/api/subjectClicked",
       data: {
           subjectId: id
       },
       success: function (res) {
           console.log('res', res);
       }
   })
});


















