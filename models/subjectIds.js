/**
 * Created by huhanwen on 2017/3/26.
 */
let mongoose = require('mongoose');
// 定义Schema
SubjectIdSchema = new mongoose.Schema({
    year: {// 年份
        type: String
    },
    subjectIds: {
        type: Array,
        // default: []
    },
    createTime: {
        type: String
    },
    lastUpdateTime: {
        type: String
    }
}, { collection: 'subjectIds'});// mongoose always add a 's' after the name of collection if you do not have the second param,because mongoose always want to be smart

// 定义Model
let SubjectIdModel = mongoose.model('subjectIds', SubjectIdSchema);

// 暴露接口
module.exports = SubjectIdModel;