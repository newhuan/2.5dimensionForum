/**
 * Created by huhanwen on 2017/3/19.
 */

let $signIn = $('#sign-in');
let $signUp = $('#sign-up');
let $2017 = $('#year-2017');
let $subjectList = $('.subject-list');
let $responses = $('.response');
let $subjectTemplete = $('#subject-templete')[0];
let subjectTemplete = $subjectTemplete.innerHTML;
let year = '2017';

// $subjectList.delegate('.title', 'click')

$('window').ready(function () {
   // console.log('123')
    $.ajax({
        type : 'get',
        url : '/api/getSucjectsWithYear',
        data : {
            "year" : year
        },
        success : function (res) {
            console.log('getSucjectsWithYear', res);
            let subjects = res.res.subjects;
            for(let i = 0, len = subjects.length; i < len; i++) {
                if(subjects[i] == null) {
                    continue;
                }
                let temp = subjectTemplete;
                temp = temp.replace(/\{\{subName\}\}/g, subjects[i].subName);
                temp = temp.replace(/\{\{clickNum\}\}/g, subjects[i].clickNum);
                temp = temp.replace(/\{\{commentNum\}\}/g, subjects[i].commentNum);
                temp = temp.replace(/\{\{id\}\}/g, subjects[i].id);
                let $subject = $(temp);
                $('.subject-list').append($subject);
            }
        }
    })
});

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
            console.log('getSucjectsWithYear', res, $subjectTemplete.innerHTML);
            let subjects = res.subjects;
        }
    })
});

$subjectList.delegate('li', 'click', function (e) {
   let evt = e || window.event;
   let id = $(this).attr("subjectid");
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
   });
    evt.stopPropagation();
});

//
// $responses.on('click', function (e) {
//    let evt = e || window.event;
//    let id = $(this).attr('subjectid');
//     console.log('comment:id', id);
//     $.ajax({
//         type: 'get',
//         url: "/api/commentAdded",
//         data: {
//             subjectId: id
//         },
//         success: function (res) {
//             console.log('res', res);
//         }
//     });
//     evt.stopPropagation();
// });
















