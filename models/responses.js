/**
 * Created by huhanwen on 2017/4/8.
 */
let mongoose = require('mongoose');

// 定义Schema
ResponsesSchema = new mongoose.Schema({
    id: {// response id
        type: String
    },
    user: { // 用户名
        type: String
    },
    postId: {
        type: String
    },
    responses: {
        type: Array
    },
    text: {
        type: String,
    },
    createTime: {
        type: String
    },
    lastUpdateTime: {
        type: String
    }
}, { collection: 'responses'});// mongoose always add a 's' after the name of collection if you do not have the second param,because mongoose always want to be smart

// 定义Model
let ResponsesModel = mongoose.model('responses', ResponsesSchema);

// 暴露接口
module.exports = ResponsesModel;