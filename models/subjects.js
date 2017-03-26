/**
 * Created by huhanwen on 2017/3/26.
 */
let mongoose = require('mongoose');
// 定义Schema
SubjectSchema = new mongoose.Schema({
    id: {// id
        type: String
    },
    picUrls: {
        type: Array,
        // default: []
    },
    subName: {//subject name
        type: String,
    },
    abstract: {//简介
        type: String,
    },
    copyRights: {
        type: Array
    },
    clickNum: {
        type: String
    },
    commentNum: {
        type: String
    }
}, { collection: 'subjects'});// mongoose always add a 's' after the name of collection if you do not have the second param,because mongoose always want to be smart

// 定义Model
let SubjectModel = mongoose.model('subjects', SubjectSchema);

// 暴露接口
module.exports = SubjectModel;