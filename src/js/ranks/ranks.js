/**
 * Created by huhanwen on 2017/4/22.
 */
// import ROOT from '../root';
const root = 'http://localhost:3000/';
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
            let clickTpl = tpl.replace('{{ranking}}',data[i].ranking);
            clickTpl = clickTpl.replace('{{subjectId}}',data[i].subjectId);
            clickTpl = clickTpl.replace('{{subName}}',data[i].subName);
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
            let commentTpl = tpl.replace('{{ranking}}',data[i].ranking);
            commentTpl = commentTpl.replace('{{subjectId}}',data[i].subjectId);
            commentTpl = commentTpl.replace('{{subName}}',data[i].subName);
            commentTpl = commentTpl.replace('{{commentNum}}',data[i].clickNum);
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
           setClickList(data[0]);
           setCommentList(data[1]);
       }
   })
});