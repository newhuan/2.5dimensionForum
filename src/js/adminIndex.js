/**
 *
 * Created by huhanwen on 2017/5/1.
 */
function checkAdmin(){
    return localStorage.getItem('dem2p5_type') === '1';
}

let $window = $('window');
$window.ready(function () {
    if(!checkAdmin()){
        document.write("404");
    }
});



const root = 'http://localhost:3000/';
let yearBefore;
let typeBefore;
let subjectIdBefore;
let siteId;
let userName;
let jurisdictionBefore;
let User;
let formDataAdd = new FormData();
let formDataRefresh = new FormData();
$window.ready(function () {

   // show sites
    getSites();
   // add subject

    let $imgAdd = $('#subject-img');
    $imgAdd.on('change', function () {
        console.log('change');
        $.each($(this)[0].files, function (i, file) {
            formDataAdd.append('upload_img', file);
        });
    });
    // let $imgRefresh = $('#subject-img-search');
    // $imgRefresh.on('change', function () {
    //     $.each($(this)[0].files, function (i, file) {
    //         formDataRefresh.append('upload_img', file);
    //     });
    // });

    let $addSubject = $('#add-subject');
    $addSubject.on('click', function () {
        let subName = $('#subject-title-add').val();
        let abstract = $('#subject-abstract').val();
        let year = $('#subject-year').val();
        let type = $('#subject-type').val();
        let video = $('#subject-video').val();
        let comment = $('#subject-comment').val();
       if(!checkEmpty(subName,abstract,year, type)) {
           alert('请填写完整');
       }else {
           let sites = [];
           let $siteItems = $('.site-checkbox');
           for(let i = 0, len = $siteItems.length; i < len; i++) {
               if($siteItems[i].checked) {
                   sites.push($siteItems[i].getAttribute('id'));
               }
           }
           // let $subjectImg = $("#subject-img");
           // if($subjectImg[0].files.length !== 0){
           //     $.each($subjectImg[0].files, function (i, file) {
           //         formDataAdd.append('upload_img', file);
           //     });
           // }


           formDataAdd.append('subName', subName);
           formDataAdd.append('abstract', abstract);
           formDataAdd.append('year', year);
           formDataAdd.append('sites', sites);
           formDataAdd.append('type', type);
           formDataAdd.append('video', video);
           formDataAdd.append('comment', comment);

            $.ajax({
                type:'post',
                url: root + 'api/addSubject',
                data: formDataAdd,
                contentType: false,
                processData: false,
                success: function (res) {
                    console.log(res);
                    if(res.state === 1){
                        alert("添加成功！");
                        initAddSubject();
                    }else{
                        alert("添加失败!");
                    }
                    initForm();
                },
                error: function (e) {
                    console.log('error', e);
                    alert("添加失败！");
                    initForm();
                }
            })
       }
    });
   // search subject
    let $searchSubject = $('#search-subject-btn');
    $searchSubject.on('click', function () {
        let subjectId = $('#subject-id-search').val();
        searchSubject(subjectId).then(function (res) {
            if(res === null){
                alert('不存在此主题!');
            }else {
                showSubject(res);
            }
        })
    });

   // update subject
    let $updateSubject = $('#update-subject');
    $updateSubject.on('click', function () {
        let id = $('#subject-id-search').val();
        let subName = $('#subject-title-search').val();
        let year = $('#subject-year-search').val();
        let abstract = $('#subject-abstract-search').val();
        let copyRights = getCheckedSites('site-list-search');
        let type = $('#subject-type-search').val();
        let video = $('#subject-video-search').val();
        let comment = $('#subject-comment-search').val();
        console.log(subName, year, abstract, copyRights);
        formDataRefresh.append('subjectId', id);
        formDataRefresh.append('subName', subName);
        formDataRefresh.append('year', year);
        formDataRefresh.append('yearBefore', yearBefore);
        formDataRefresh.append('abstract', abstract);
        formDataRefresh.append('copyRights', copyRights);
        formDataRefresh.append('type', type);
        formDataRefresh.append('typeBefore', typeBefore);
        formDataRefresh.append('video', video);
        formDataRefresh.append('comment', comment);
        let $subjectImgSearch = $('#subject-img-search');
        let imgState;
        if($subjectImgSearch[0].files.length === 0){
            imgState = 1;

        }else{
            $.each($subjectImgSearch[0].files, function (i, file) {
                formDataRefresh.append('upload_img', file);
            });
            imgState = 0;
        }
        formDataRefresh.append('imgState', imgState);


        updateSubject(formDataRefresh).then(function (res) {
            console.log(res);
            if(res.msg_id === '1') {
                alert('修改成功！');

            }else {
                alert('修改失败，请稍后再试！');
            }
            initForm();
        })
    });

   // delete subject
    let $deleteSubject = $('#delete-subject');
    $deleteSubject.on('click', function () {
        if(!subjectIdBefore||!yearBefore||!typeBefore){
            alert('请先确定要查找的主题id');
        }else {
            deleteSubject(subjectIdBefore, yearBefore, typeBefore).then(function (res) {
                if(res.msg_id === '1') {
                    alert('删除成功！');
                }else {
                    alert('删除失败，请稍后重试！');
                }
                initForm();
            });
        }

    });

   // search users
    let $userSearch = $('#user-search');
    $userSearch.on('click', function (e) {
        refreshUserList();
        let userName = $('#user-name').val();
        let jurisdiction = $('#user-jurisdiction').val();
        if(!checkEmpty(userName,jurisdiction)) {
            alert('请填写完整');
        }else {
            $.ajax({
                type:'get',
                url: root + 'api/searchUser',
                data: {
                    userName,
                    jurisdiction:jurisdiction == 'normal'?0:1
                },
                success: function (res) {
                    console.log(res);
                    if(res.res.length === 0){
                        return;
                    }
                    jurisdictionBefore = res.res[0].user ? 0 : 1;
                    User = res.res[0].user ? res.res[0].user : res.res[0].adminUser;
                    showUsers(res.res);
                },
                error: function (e) {
                    console.log("error", e);
                }
            })
        }
    });

   // delete user
    let $userList = $('.user-list');
    $userList.delegate('.delete-user', 'click', function () {
        console.log('delete clicked');
        let userName = $(this).parent().find('.user-name').find('input').attr('id');
        let jurisdiction = $(this).parent().find('select').val()=='normal'?0:1;
        if(!checkEmpty(userName)){
            alert('请填写完整');
        }else {
            $.ajax({
                type:'post',
                url: root+ 'api/deleteUser',
                data: {
                    userName, jurisdiction
                },
                success:function (res) {
                    console.log(res)
                },
                error: function (err) {
                    console.log('error', err);
                }
            })
        }
    });

   // change jurisdiction
    $userList.delegate('.change-jurisdiction', 'click', function () {
        let jurisdiction = $(this).parent().find('select').val() === 'normal'? 0 : 1;
        changeJurisdiction(User,jurisdiction,jurisdictionBefore).then(function (res) {
            console.log(res);
            if(res.msg_id!==1){
                alert('修改失败，请稍后重试！');
            }else {
                alert('修改成功');
                refreshUserSearch();
            }
        })
    });

   // search posts
   let $postSearchBtn = $('#postSearch');
    $postSearchBtn.on('click', function (e) {
        refreshPostList();
        let id = $('#post-id').val();
        let title = $('#post-title').val();
        let userName = $('#post-user-name').val();
        $.ajax({
            type:'get',
            url: root+ 'api/searchPosts',
            data: {
                subjectId: id,
                title,
                userName,
                id: ""
            },
            success: function (res) {
                console.log(res);
                showPosts(res.postList);
            },
            error: function (e) {
                console.log(e);
            }
        })
    });

//    delete post
    let $postList = $('.post-list');
    $postList.delegate('.delete-post', 'click', function (e) {
        console.log('$postDeleteBtnClicked');

        let postId = $(this).parent().find('.post-id-ipt').val();
        let userName = $(this).parent().parent().parent().find('#post-user-name').val();
        console.log(postId);
        $.ajax({
            type:'post',
            url: root+ 'api/deletePost',
            data: {
                postId,userName
            },
            success: function (res) {
                console.log(res);
                // showPosts(res);
            },
            error: function (e) {
                console.log(e);
            }
        })
    });

//    add site
    let $addSite = $('#add-site');
    $addSite.on('click', function (e) {
        console.log('add site button cilcked');
        let domainName = $('#domainName').val();
        let name = $('#name').val();
        if(!checkEmpty(domainName, name)) {
            alert('请填写完整');
        }else {
            $.ajax({
                type:'post',
                url: root + 'api/addSites',
                data: {
                    domainName, name
                },
                success: function (res) {
                    console.log(res);
                    // showPosts(res);
                },
                error: function (e) {
                    console.log(e);
                }
            })
        }
    });

//  search site
    let $searchSite = $('#site-search-btn');
    $searchSite.on('click', function () {
       let name = $('#site-id-search').val();
        searchSite(name).then(function (res) {
            console.log(res);
            if(res.msg_id != 1){
                alert('搜索失败，请稍后重试！');
            }else {
                showSiteSearchResult(res.site);
            }
        })
    });

//  update site
    let $updateSite = $('#site-update-btn');
    $updateSite.on('click', function () {
        let domainName = $('#site-search-result-domain-name').val();
        let name = $('#site-search-result-name').val();
        updateSite(siteId, name, domainName).then(function (res) {
            console.log(res);
            if(res.msg_id != 1) {
                alert('修改失败，请稍后重试！');
            }else {
                alert("修改成功！");
            }
        })
    });

//    delete site
    let $deleteSite = $('#site-delete-btn');
    $deleteSite.on('click', function () {
        deleteSite(siteId).then(function (res) {
            console.log(res);
            if(res.msg_id!==1) {
                alert("删除失败，请稍后重试!");
            }else {
                alert('删除成功!');
                refreshSiteSearch();
            }
        })
    })
});
//subject
function searchSubject(id) {
    return new Promise(function(resolve, reject){
        $.ajax({
            type:'get',
            url: root + "api/getSubjectDetail",
            data: {
                subjectId: id
            },
            success:function (res) {
                resolve(res);
            },
            error: function (e) {
                reject(e);
            }
        })
    })
}

function showSubject(data) {
    subjectIdBefore = data.id;
    yearBefore = data.year ? data.year : 2017;
    typeBefore = data.type ? data.type : "热血";
    $('#subject-title-search').val(data.subName);
    $('#subject-year-search').val(yearBefore);
    $('#subject-type-search').val(typeBefore);
    $('#subject-abstract-search').val(data.abstract);
    $('#subject-video-search').val(data.video);
    $('#subject-comment-search').val(data.comment);
    let $sites = $('#site-list-search');
    for(let i = 0, len = data.copyRights.length; i < len;i++) {
        $sites.children().find('#'+data.copyRights[i]).attr({
            checked:true
        });
    }
}

function updateSubject(data) {

    return new Promise(function (resolve, reject) {
        $.ajax({
            type: 'post',
            data,
            contentType: false,
            processData: false,
            url: root + "api/updateSubject",
            success: function (res) {
                resolve(res);
            },error: function (e) {
                reject(e);
            }
        })
    })
}

function deleteSubject(id, year, type) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type:'post',
            data:{
                subjectId:id,
                year,
                type
            },
            url:root+ 'api/deleteSubject',
            success: function (res) {
                resolve(res);
            },
            error: function (e) {
                reject(e);
            }
        })
    })
}

function initAddSubject() {
    // formDataAdd = new FormData();
}

function initSearchSubject() {
    formDataRefresh = new FormData();
}

//form
function initForm() {
    window.location.reload();
}

//Post
function showPosts(data) {
    let postTpl = $('#post-item-template').html();
    let $postList = $('.post-list');
    for(let i = 0, len = data.length; i < len; i++) {
        if(!data[i]){
            continue;
        }
        let post = postTpl.replace('{{postId}}', data[i].id);
        post = post.replace('{{postTitle}}', data[i].title);
        $postList.append($(post));
        console.log($postList);
    }
}

function refreshPostList() {
    $('.post-list').html('');
}
//User
function showUsers(data) {
    let userTpl = $('#user-item-template').html();
    let $userList = $('.user-list');
    for(let i = 0, len = data.length; i < len; i++) {
        if(!data[i].adminUser){
            let user = userTpl.replace('{{userName}}', data[i].user);
            user = user.replace('{{userName}}', data[i].user);
            let $user = $(user);
            $user.find('select').val('normal');
            $userList.append($user);
        }else {
            let user = userTpl.replace('{{userName}}', data[i].adminUser);
            user = user.replace('{{userName}}', data[i].adminUser);
            let $user = $(user);
            $user.find('select').val('admin');
            $userList.append($user);
        }

    }
}

function refreshUserList() {
    $('.user-list').html('');
}

function refreshUserSearch() {

}

function changeJurisdiction(user, jurisdiction, jurisdictionBefore) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: 'post',
            url: root + "api/changeUserJurisdiction",
            data: {
                user,
                jurisdiction,
                jurisdictionBefore
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

//Sites
function showSites(data) {
    let siteTpl = $('#site-item-template').html();
    let $siteList = $('.site-list');
    for(let i = 0, len = data.length; i < len; i++) {
        let site = siteTpl.replace('{{name}}', data[i].name);
        site = site.replace('{{name}}', data[i].name);
        site = site.replace('{{id}}', data[i].id);
        $siteList.append($(site));
    }
}

function showSiteSearchResult(data) {
    refreshSiteSearch();
    if(data === null){
        alert('搜索结果不存在！')
    }else {
        $('#site-search-result-domain-name').val(data.domainName);
        $('#site-search-result-name').val(data.name);
    }

}

function refreshSiteSearch() {
    $('#site-search-result-domain-name').val("");
    $('#site-search-result-name').val("");
}

function searchSite(name) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type:'get',
            url: root+ "api/getSiteByName",
            data: {
                name
            },
            success: function (res) {
                if(res.site !== null){
                    siteId = res.site.id;
                }
                resolve(res);
            },
            error: function (e) {
                reject(e);
            }
        })
    })
}

function updateSite(id, name, domainName) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type:'post',
            url: root + "api/updateSite",
            data: {
                id,
                name,
                domainName
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

function deleteSite(id) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: 'post',
            url: root + 'api/deleteSite',
            data: {
                id
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

function getSites() {
    $.ajax({
        type: "get",
        url: root + "api/getAllSites",
        data: {

        },
        success: function (res) {
            console.log(res);
            showSites(res.res);
        },error: function (e) {
            console.log('get site error', e);
        }
    })
}

function getCheckedSites(listID) {
    let sites = Array.from($('#' + listID).find('.site-checkbox'));
    let copyRights = [];
    sites.forEach(function (key) {
        // console.log(key.is('checked'));
        if($(key).is(':checked')){
            copyRights.push($(key).attr('id'));
        }
    });
    return copyRights;
}

