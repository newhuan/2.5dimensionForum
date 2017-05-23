/**
 * Created by huhanwen on 2017/3/19.
 */

// let $signIn = $('#sign-in');
// let $signUp = $('#sign-up');
const root = "http://localhost:3000/";
let $subjectList = $('.subject-list');
let $responses = $('.response');
let $subjectTemplete = $('#subject-templete')[0];
let subjectTemplete = $subjectTemplete.innerHTML;
let yearNow = '2017';
let pageMsg = {
    numEvPage: 8,
    currentPage: 1,
    pageNum: 1
};
let subjectMsg = {
    subjectList: [],
    subjectNum: 0,
    currentSubjectList: []
};

// $subjectList.delegate('.title', 'click')

$('window').ready(function () {
    isLogin(function (msg_id) {
        if(msg_id == -1) {

        }else if (msg_id == 1) {
            let user = localStorage.getItem('dem2p5_user');
            let password = localStorage.getItem('dem2p5_pwd');
            let type = localStorage.getItem('dem2p5_type');
            setSignIn(user, password, type);
        } else {

        }

    });

   // console.log('123')
    initSubjectList();

//    sign in up out models
    let $signs = $('.sign');
    let $models = $('.model');
    let $close = $('.close');
    let $modelLayout = $('.model-layout');
    $close.on('click', function () {
       $modelLayout.hide();
    });

    $signs.on('click', function () {
        if(!$(this).hasClass('active')){
            $signs.toggleClass('active');
            $models.toggle();
        }else {

        }
    });

    //sign in up out button
    let $signIn = $('#sign-in');
    let $signUp = $('#sign-up');
    let $signOut = $('#sign-out');

    $signIn.on('click', function () {
        $modelLayout.show();
        $('.sign-in-tab').click();
    });

    $signUp.on('click', function () {
        $('.sign-up-tab').click();
        $modelLayout.show();
    });

    $signOut.on('click', function () {

        setSignOut();
    });

    //sign in & sign up submit
    let $signInSubmit = $('#sign-in-submit');
    let $signUpSubmit = $('#sign-up-submit');

    $signInSubmit.on('click', function () {
        let user = $('#user-up').val(),
            password = $('#pwd-up').val(),
            type = $('.user-type:checked').val();

        console.log("type",type);
        let signInPromise = new Promise(function (resolve, reject) {
            $.ajax({
                    type : 'get',
                    url : '/api/signIn',
                    data : {
                        user,
                        password,
                        type
                    },
                    success : function (res) {
                        console.log(res);
                        resolve(res);
                    },
                    error: function (e) {
                        reject(e);
                    }
            });
        });

        signInPromise.then(function (res) {

            console.log('then',res.msg_id);//0 1 2
            if(res.msg_id == 1){
                setSignIn(user, password, type);
                $close.click();
                if(type === "1"){
                    window.location.href = "./adminIndex.html";
                }
            }else if(res.msg_id == 0){
                alert('密码错误，请重新输入！');
            }else {
                alert('不存在此用户，请重新输入！');
            }

        }).catch(function (err) {
            console.log('catch', err);

        })
    });

    $signUpSubmit.on('click', function () {
        console.log('as');
        let user, password, repwd;
        user = $('#user-in').val();
        password = $('#pwd-in').val();
        repwd = $('#rePwd-in').val();
        if(!checkEmpty(user, password, repwd)){
            alert("请填写完整!");
            return;
        }

        if(password!== repwd){
            alert("两次密码输入不一致，请重新输入！");
        }
        if(!regPwd.test(password)||/^\d{8,16}$/.test(password)){
            alert("密码非法，请重新输入！");
            return;
        }

        signUp(user,password).then(function (res) {
            if(res.msg_id === "4"){
                alert("此用户已存在，请重新输入用户名！");
                return;
            }
           if(res.msg_id !== "1"){
               alert("注册失败，请稍后重试！");
           }else {
               alert("注册成功！");
               $('.close').click();
           }

        });
    });


    let $moreYears = $('#more-years');
    $moreYears.on('click', function () {
       $('.more-years').hide();
       $('.years-container').show();
       $('.years-more-btn').show();
    });

    let $concelBtn = $('#concel-year');
    $concelBtn.on('click', function () {
        $('.more-years').show();
        $('.years-container').hide();
        $('.years-more-btn').hide();
    });

    let $submitYearBtn = $('#submit-year');
    $submitYearBtn.on('click', function () {
       let year = $.trim($('#years').val());
        refreshSubjectListByYear(year);
    });

    //change page
    let $pageController = $('#page-controller');
    $pageController.delegate('.page-num', 'click', function () {
        let pageNum = parseInt($(this).html());
        if(pageNum === pageMsg.currentPage){
            return;
        }
        changeToPage(pageNum);
    });

    $pageController.delegate('.page-prev', 'click', function () {
        let pageNum = pageMsg.currentPage;
        if(pageNum === 1){
            return;
        }
        changeToPage(pageNum - 1);
    });

    $pageController.delegate('.page-next', 'click', function () {
        let pageNum = pageMsg.currentPage;
        if(pageNum === pageMsg.pageNum){
            return;
        }
        changeToPage(pageNum + 1);
    });


    //get subjects by year
    let $years = $('.years');
    $years.on('click', function () {
        let year = $.trim($(this).html());
        refreshSubjectListByYear(year);
        if($(this).hasClass('active')){
            return;
        }
        $years.removeClass('active');
        $(this).addClass('active');
    });



    //ready end
});
//ce shi git
let $userName = $('#user-name');
let $signOut = $('#sign-out');
//sign in up out button
let $signIn = $('#sign-in');
let $signUp = $('#sign-up');

function setSignIn(user, password, type) {
    setLocalStorageSignIn(user, password, type);
    $signIn.hide();
    $signUp.hide();
    $userName.html(user);
    $userName.show();
    $signOut.show();
}

function setSignOut() {
    setLocalStorageSignOut();
    $userName.html(' ');
    $userName.hide();
    $signOut.hide();
    $signIn.show();
    $signUp.show();
}

function signUp(user, password) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type:'post',
            url: root + "api/signUp",
            data: {
                user,
                password
            },
            success: function (res) {
                resolve(res);
            },
            error: function (e) {
                reject(e);
            }
        })
    })
}

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
           // console.log('res', res);
       }
   });
    evt.stopPropagation();
});

function initSubjectList() {
    refreshSubjectListByYear(yearNow);
}

function refreshSubjectListByYear(year) {
    getSubjectsByYear(year).then(function (subjects) {
        clearSubjectList();
        showSubject(subjects);
    })
}

function showSubject(subjects) {
    if(subjects.length === 0){
        return;
    }
    for(let i = 0, len = subjects.length; i < len; i++) {
        if(subjects[i] === null) {
            continue;
        }
        addSubjectToSubjectList(subjects[i]);
    }
}

function clearSubjectList() {
    $('.subject-list').html("");
}

function getSubjectsByYear(year) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type : 'get',
            url : root + 'api/getSucjectsWithYear',
            data : {
                year
            },
            success : function (res) {
                let subjectList = clearSubjectData(res.res.subjects);
                setSubjectAndPageMsg(subjectList);
                refershPageControl();
                resolve(subjectMsg.currentSubjectList);
            },
            error:function (e) {
                reject(e);
            }
        });
    })
}

function addSubjectToSubjectList(subject) {
    let temp = subjectTemplete;
    temp = temp.replace(/\{\{subName\}\}/g, subject.subName);
    temp = temp.replace(/\{\{clickNum\}\}/g, subject.clickNum);
    temp = temp.replace(/\{\{commentNum\}\}/g, subject.commentNum);
    temp = temp.replace(/\{\{id\}\}/g, subject.id);
    // console.log(temp)
    let $subject = $(temp);
    // console.log($subject);
    $('.subject-list').append($subject);
}

function clearSubjectData(subjects) {
    let subjectList = [];
    subjects.forEach(function (subject) {
        if(subject !== null){
            subjectList.push(subject);
        }
    });
    return subjectList;
}

function getCurrentSubjectList() {
    return subjectMsg.currentSubjectList;
}

function setSubjectAndPageMsg(subjectList) {
    subjectMsg.subjectList = subjectList;
    pageMsg.pageNum = parseInt(subjectList.length / pageMsg.numEvPage) + 1;
    if(pageMsg.pageNum > 1){
        subjectMsg.currentSubjectList = subjectMsg.subjectList.slice(0, pageMsg.numEvPage);
    }else {
        subjectMsg.currentSubjectList = subjectMsg.subjectList;
    }
}

function refreshSubjectAndPageMsg(page) {
    pageMsg.currentPage = page;
    subjectMsg.currentSubjectList = subjectMsg.subjectList.slice((page - 1) * pageMsg.numEvPage, page * pageMsg.numEvPage);
}

function refershPageControl() {
    if(pageMsg.pageNum === 1){
        $('#page-controller').html($('#page-num-tpl-init').html());
        return
    }
    let pageNumTpl = $('#page-num-tpl').html();
    for(let i = 2; i <= pageMsg.pageNum; i++){
        let $pageNum = pageNumTpl.replace('{{num}}', i);
        $('.page-next').before($($pageNum));
    }
}

function changeToPage(pageNum) {
    clearSubjectList();
    refreshSubjectAndPageMsg(pageNum);
    showSubject(subjectMsg.currentSubjectList);
}








