/**
 * Created by huhanwen on 2017/3/19.
 */
$('window').on('load',function () {

});
let $signIn = $('#sign-in');
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
    setTimeout(function () {
        $.ajax({
            type : 'get',
            url : '/api/signIn',
            data : {
                "user" : "11111111111",
                password : '11111aa'
            },
            success : function (res) {
                console.log(res);
            }
        })
    },10000)
});