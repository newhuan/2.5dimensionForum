/**
 * Created by huhanwen on 2017/4/17.
 */
let mongoose = require('mongoose');

// 定义Schema
clickRankingsSchema = new mongoose.Schema({
    ranking: {// post id
        type: String
    },
    subjectId: { // 密码
        type: String
    },
    subName: {
        type: String,
    },
    clickNum: {
        type: String
    }
}, { collection: 'clickRankings'});// mongoose always add a 's' after the name of collection if you do not have the second param,because mongoose always want to be smart

// 定义Model
let clickRankingsModel = mongoose.model('clickRankings', clickRankingsSchema);

// 暴露接口
module.exports = clickRankingsModel;