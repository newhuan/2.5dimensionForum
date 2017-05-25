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
let regPwd = new RegExp('^[!"#$%&\'\(\)*+,-./0-9:;<=>?@A-Z[\\]^_`a-z{|}~]{8,16}$');
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
let searchMsg = {
    year:'2017',
    type:'全部',
    subName:""
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
        searchMsg.year = year;
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
        searchMsg.year = year;
        refreshSubjectList();
        // refreshSubjectListByYear(year);
        if($(this).hasClass('active')){
            return;
        }
        $years.removeClass('active');
        $(this).addClass('active');
    });

    let $subName = $('#subName-search');
    $subName.on('change', function () {
        searchMsg.subName = $(this).val();
    });

    //search
    let $search = $('#search-submit');
    $search.on('click', function () {
       searchMsg.subName = $subName.val();
       refreshSubjectList();
    });
    //concel
    let $concel = $('#search-concel');
    $concel.on('click', function () {
        $subName.val("");
        searchMsg.subName = "";
        refreshSubjectList();
    });

    //change type
    let $type = $('.type');
    $type.on('click', function () {
       searchMsg.type = $.trim($(this).html());
        refreshSubjectList();
        if($(this).hasClass('type-active')){
            return;
        }
        $type.removeClass('type-active');
        $(this).addClass('type-active');
    });

    //record(记录) click on subject
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
    //ready end
});
//ce shi git
let $userName = $('#user-name');
let $signOut = $('#sign-out');
//sign in up out button
let $signIn = $('#sign-in');
let $signUp = $('#sign-up');

/**********************************/
/****** sign in up out ************/
/**********************************/
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

/**********************************/
/****** subjec list ***************/
/**********************************/
function initSubjectList() {
    refreshSubjectListByYear(yearNow);
}

function refreshSubjectList() {
    let url = "";
    let data = {},
        year = searchMsg.year,
        type = searchMsg.type,
        subName = searchMsg.subName;
    if(searchMsg.year === "全部"){
        if(searchMsg.type === "全部"){
            if(searchMsg.subName === ""){
                url = "api/getAllSubjects";
            }else{
                url = "api/searchSubjectInAllSubjects";
                data = {
                    subName
                };
            }
        }else{
            if(searchMsg.subName === ""){
                url = "api/getSubjectsWithTypeInAllYear";
                data = {
                    type
                };
            }else{
                url = "api/serchSubjectInWithType";
                data = {
                    subName,
                    type
                }
            }
        }
    }else{
        if(searchMsg.type === "全部"){
            if(searchMsg.subName === ""){
                url = "api/getSucjectsWithYear";
                data = {
                    year
                }
            }else{
                url = "api/searchSubjectWithYear";
                data = {
                    year,
                    subName
                }
            }
        }else{
            if(searchMsg.subName === ""){
                url = "api/getSucjectsWithTypeAndYear";
                data = {
                    year,
                    type
                }
            }else{
                url = "api/searchSubjectWitheTypeAndYear";
                data = {
                    year,
                    type,
                    subName
                }
            }
        }
    }
    searchSubject(url, data).then(function (subjectList) {
        handleSubjectList(subjectList);
    })
}

function refreshSubjectListByYear(year) {
    getSubjectsByYear(year).then(function (subjectList) {
        handleSubjectList(subjectList);
    })
}

//get and show subjects queryed by type and year
//if year is undefined get all subjects in this type
function refershSubjectListByTypeAndYear(type, year) {
    getSubjectsByTypeAndYear(type, year).then(function (subjectList) {
        handleSubjectList(subjectList);
    }).catch(function (e) {
        console.log("refershSubjectListByTypeAndYearError", e);
    })
}

function searchSubject(url, data) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "get",
            url: root + url,
            data,
            success:function (res) {
                if(url === "api/getSucjectsWithYear"){
                    resolve(res.res.subjects);
                    return;
                }
                resolve(res.subjects);
            },
            error: function (e) {
                reject(e);
            }
        })
    })
}

//封装从获取数据到渲染页面包含分页操作
function handleSubjectList(subjectList) {
    InitSubjectAndPageData(subjectList);
    refershPageControl();
    showSubject(subjectMsg.currentSubjectList);
}

//get subjects by year
function getSubjectsByYear(year) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type : 'get',
            url : root + 'api/getSucjectsWithYear',
            data : {
                year
            },
            success : function (res) {
                resolve(res.res.subjects);
            },
            error:function (e) {
                reject(e);
            }
        });
    })
}

//get subjects by type and year
//if year is undefined get all subjects in this type
function getSubjectsByTypeAndYear(type, year) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type : 'get',
            url : root + 'api/getSucjectsWithTypeAndYear',
            data : {
                year,
                type
            },
            success : function (res) {
                resolve(res.subjects);
            },
            error:function (e) {
                reject(e);
            }
        });
    })
}

//show subjects into page
function showSubject(subjects) {
    clearSubjectList();
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

//clear all elements in subjectList
function clearSubjectList() {
    $('.subject-list').html("");
}

//create subject element and append it into subjectList
function addSubjectToSubjectList(subject) {
    let temp = subjectTemplete;
    temp = temp.replace(/\{\{subName\}\}/g, subject.subName);
    temp = temp.replace(/\{\{clickNum\}\}/g, subject.clickNum);
    temp = temp.replace(/\{\{commentNum\}\}/g, subject.commentNum);
    temp = temp.replace(/\{\{id\}\}/g, subject.id);
    temp = temp.replace(/\{\{year\}\}/g, subject.year);
    temp = temp.replace(/\{\{type\}\}/g, subject.type);
    temp = temp.replace(/\{\{comment\}\}/g, subject.comment);
    temp = temp.replace(/\{\{abstract\}\}/g, subject.abstract);
    temp = temp.replace(/\{\{pic\}\}/g, subject.picUrls[0]);
    // console.log(temp)
    let $subject = $(temp);
    // console.log($subject);
    $('.subject-list').append($subject);
}

/**********************************/
/****** page and subject data *****/
/**********************************/

//change to pageNum
function changeToPage(pageNum) {
    clearSubjectList();
    refreshSubjectAndPageMsg(pageNum);
    showSubject(subjectMsg.currentSubjectList);
}

//reset subjectMsg and pageMsg by subjects
//and pageController
//set subjectMsg and pageMsg with a new subjectList
//it can be used when
// 1. change year
// 2. change type and year
// 3. search subject by subNum
// 4. search subject by subNum and year
// 5. search subject by type and year
//根据获取的主题数据刷新主题数据和分页数据
function InitSubjectAndPageData(subjects) {
    let subjectList = clearSubjectData(subjects);
    // setSubjectAndPageMsg(subjectList);
    subjectMsg.subjectList = subjectList;
    let len = subjectList.length;
    if(len % pageMsg.numEvPage === 0){
        pageMsg.pageNum = parseInt(len / pageMsg.numEvPage)
    }else {
        pageMsg.pageNum = parseInt(len / pageMsg.numEvPage) + 1;
    }

    if(pageMsg.pageNum > 1){
        subjectMsg.currentSubjectList = subjectMsg.subjectList.slice(0, pageMsg.numEvPage);
    }else {
        subjectMsg.currentSubjectList = subjectMsg.subjectList;
    }
}

//delete invalid data in subjects
function clearSubjectData(subjects) {
    let subjectList = [];
    console.log(subjects)
    subjects = Array.from(subjects);
    subjects.forEach(function (subject) {
        if(subject !== null){
            subjectList.push(subject);
        }
    });
    return subjectList;
}

//refresh elements in page controller
function refershPageControl() {
    $('#page-controller').html($('#page-num-tpl-init').html());
    if(pageMsg.pageNum === 1){
        return
    }
    let pageNumTpl = $('#page-num-tpl').html();
    for(let i = 2; i <= pageMsg.pageNum; i++){
        let $pageNum = pageNumTpl.replace('{{num}}', i);
        $('.page-next').before($($pageNum));
    }
}

//refresh subjectMsg and pageMsg with a new pageNum
function refreshSubjectAndPageMsg(page) {
    pageMsg.currentPage = page;
    subjectMsg.currentSubjectList = subjectMsg.subjectList.slice((page - 1) * pageMsg.numEvPage, page * pageMsg.numEvPage);
}





