/**
 * Created by huhanwen on 2017/4/22.
 */
// import ROOT from '../root';
const root = 'http://localhost:3000/';
let rankingMsg = {
    numEvPage: 10,
    clickList: [],
    commentList: [],
    currentClickList: [],
    currentCommentList: [],
    clickCurrentPage: 1,
    commentCurrentPage: 1,
    totalPages: 1,
    totalNum: 0
}

function setClickList(dataInit) {
    // console.log(dataInit);
    let data = [];
    dataInit.forEach(function (key) {
       if(key!=null) {
           data.push(key);
       }
    });
    data.sort(function (key1, key2) {
        // console.log(key1, key2);
        return key1.ranking - key2.ranking;
    });
    // console.log(data);
    let tpl = $('#tpl-ranks-click').html();
    let $clickUl = $('.clickList');
    for(let i = 0, len = data.length; i < len; i++) {
        if(data[i] != null) {
            let clickTpl = tpl.replace('{{ranking}}',data[i].ranking + 1);
            clickTpl = clickTpl.replace('{{subjectId}}',data[i].id);
            clickTpl = clickTpl.replace('{{picurl}}',data[i].picUrls[0]);
            clickTpl = clickTpl.replace('{{comment}}',data[i].comment);
            clickTpl = clickTpl.replace('{{subName}}',data[i].subName);
            clickTpl = clickTpl.replace('{{clickNum}}',data[i].clickNum);
            clickTpl = clickTpl.replace('{{clickNum}}',data[i].clickNum);
            $clickUl.append($(clickTpl));
        }
    }
}

function setCommentList(dataInit) {
    console.log(dataInit);
    let data = [];
    dataInit.forEach(function (key) {
        if(key!=null) {
            data.push(key);
        }
    });
    data.sort(function (key1, key2) {
        // console.log(key1, key2);
        return key1.ranking - key2.ranking;
    });
    let tpl = $('#tpl-ranks-comment').html();
    let $commentUl = $('.commentList');
    for(let i = 0, len = data.length; i < len; i++) {
        if(data[i] != null) {
            let commentTpl = tpl.replace('{{ranking}}',data[i].ranking + 1);
            commentTpl = commentTpl.replace('{{subjectId}}',data[i].id);
            commentTpl = commentTpl.replace('{{subName}}',data[i].subName);
            commentTpl = commentTpl.replace('{{picurl}}',data[i].picUrls[0]);
            commentTpl = commentTpl.replace('{{comment}}',data[i].comment);
            commentTpl = commentTpl.replace('{{commentNum}}',data[i].commentNum);
            commentTpl = commentTpl.replace('{{commentNum}}',data[i].commentNum);
            $commentUl.append($(commentTpl));
        }
    }
}



$('document').ready(function () {
   $.ajax({
       url: root + 'api/getRankingList',
       type: 'get',
       data: {

       },
       success: function (data) {
           // let data = JSON.parse(res);
           // console.log(...data[0],...data[1]);
           getSubjects(getIdArray(data[0])).then(function (subjects) {
               // setClickList(subjects);
               getSubjects(getIdArray(data[1])).then(function (subjects2) {
                   // setCommentList(subjects2);
                   initMsg(subjects, subjects2);
                   initPageSelect();
                   changeToPage(1);
               }).catch();
           }).catch();
           // setClickList(getSubjects());
           // setCommentList(getSubjects());
       }
   });

   let $clickPrev = $('.page-prev-click');
   $clickPrev.on('click', function () {
       clickChangeToPage(rankingMsg.clickCurrentPage - 1);
   });
   let $clickNext = $('.page-next-click');
   $clickNext.on('click', function () {
       clickChangeToPage(rankingMsg.clickCurrentPage + 1);
   });
   let $clickNum = $('#page-num-click');
   $clickNum.on('change', function () {
       clickChangeToPage($(this).val());
   });
    let $commentPrev = $('.page-prev-comment');
    $commentPrev.on('click', function () {
        commentChangeToPage(rankingMsg.commentCurrentPage - 1);
    });
    let $commentNext = $('.page-next-comment');
    $commentNext.on('click', function () {
        commentChangeToPage(rankingMsg.commentCurrentPage + 1);
    });
    let $commentNum = $('#page-num-comment');
    $commentNum.on('change', function () {
        commentChangeToPage($(this).val());
    });

});

function getIdArray(data) {
    let ids = [];
    data.forEach(function (key) {
        ids.push(key.subjectId);
    });
    return ids;
}

function getSubjects(subjectList) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "get",
            url: root + "api/getRankingSubjects",
            data: {
                subjectList
            },
            success: function (res) {
                if(res.msg_id===1){
                    resolve(res.subjects);
                }else{
                    reject();
                }
            },
            error: function (e) {
                reject();
            }
        })
    })
}

function initMsg(clickRanking, commentRanking) {
    clickRanking.sort(function (rank1, rank2) {
       return rank2.clickNum - rank1.clickNum;
    });
    commentRanking.sort(function (rank1, rank2) {
        return rank2.commentNum - rank1.commentNum
    });

    for(let i = 0, len = clickRanking.length; i < len;i++){
        clickRanking[i].ranking = i;
        commentRanking[i].ranking = i;
    }

    rankingMsg.clickList = clickRanking;
    rankingMsg.commentList = commentRanking;
    rankingMsg.currentClickList = clickRanking.slice(0, rankingMsg.numEvPage);
    rankingMsg.currentCommentList = commentRanking.slice(0, rankingMsg.numEvPage);
    rankingMsg.clickCurrentPage = 1;
    rankingMsg.commentCurrentPage = 1;
    rankingMsg.totalPages = clickRanking.length % rankingMsg.numEvPage === 0 ? parseInt(clickRanking.length / rankingMsg.numEvPage) : parseInt(clickRanking.length / rankingMsg.numEvPage) + 1;
}

function initPageSelect() {
    if(rankingMsg.totalPages === 1){
        return;
    }
    for(let i = 2, len = rankingMsg.totalPages;i <= len; i++){
        let tpl = $('#page-value').html();
        tpl = tpl.replace('{{val}}', i);
        tpl = tpl.replace('{{num1}}', (i-1)*rankingMsg.numEvPage+1);
        tpl = tpl.replace('{{num2}}',i < len ? i*rankingMsg.numEvPage:rankingMsg.clickList.length);
        $('#page-num-comment').append($(tpl));
        $('#page-num-click').append($(tpl));
    }
}

function clickChangeToPage(pageNum) {
    if(pageNum === rankingMsg.currentClickList || pageNum > rankingMsg.totalPages || pageNum <= 0){
        return;
    }
    rankingMsg.clickCurrentPage = pageNum;
    rankingMsg.currentClickList = rankingMsg.clickList.slice((pageNum - 1) * rankingMsg.numEvPage, pageNum * rankingMsg.numEvPage);
    clearClickRankingList();
    setClickList(rankingMsg.currentClickList);
    $('#page-num-click').val(pageNum);
    window.scroll(0, 0);
}

function commentChangeToPage(pageNum) {
    if(pageNum === rankingMsg.currentCommentList || pageNum > rankingMsg.totalPages || pageNum <= 0){
        return;
    }
    rankingMsg.commentCurrentPage = pageNum;
    rankingMsg.currentCommentList = rankingMsg.commentList.slice((pageNum - 1) * rankingMsg.numEvPage, pageNum * rankingMsg.numEvPage);
    clearCommentRankingList();
    setCommentList(rankingMsg.currentCommentList);
    $('#page-num-comment').val(pageNum);
}

function changeToPage(pageNum) {
    if(pageNum > rankingMsg.totalPages || pageNum <= 0){
        return;
    }
    rankingMsg.clickCurrentPage = pageNum;
    rankingMsg.commentCurrentPage = pageNum;
    rankingMsg.currentClickList = rankingMsg.clickList.slice((pageNum - 1) * rankingMsg.numEvPage, pageNum * rankingMsg.numEvPage);
    rankingMsg.currentCommentList = rankingMsg.commentList.slice((pageNum - 1) * rankingMsg.numEvPage, pageNum * rankingMsg.numEvPage);
    clearRankingList();
    setClickList(rankingMsg.currentClickList);
    setCommentList(rankingMsg.currentCommentList);
}

function clearClickRankingList() {
    $('.clickList').html("");
}

function clearCommentRankingList() {
    $('.commentList').html("");
}

function clearRankingList() {
    $('.rankingList').html("");
}
