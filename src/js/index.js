/**
 * Created by huhanwen on 2017/3/19.
 */
$('window').on('load',function () {

});
let $signIn = $('#sign-in');
let $signUp = $('#sign-up');
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