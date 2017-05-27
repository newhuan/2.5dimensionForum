/**
 * Created by huhanwen on 2017/4/17.
 */
let mongoose = require('mongoose');

// 定义Schema
commentRankingsSchema = new mongoose.Schema({
    ranking: {// post id
        type: String
    },
    subjectId: { // 密码
        type: String
    },
    subName: {
        type: String,
    },
    commentNum: {
        type: String
    },
    createTime: {
        type: String
    },
    lastUpdateTime: {
        type: String
    }
}, { collection: 'commentRankings'});// mongoose always add a 's' after the name of collection if you do not have the second param,because mongoose always want to be smart

// 定义Model
let commentRankingsModel = mongoose.model('commentRankings', commentRankingsSchema);

// 暴露接口
module.exports = commentRankingsModel;