/**
 * Created by huhanwen on 2017/3/26.
 */
let mongoose = require('mongoose');

// 定义Schema
PostsSchema = new mongoose.Schema({
    id: {// post id
        type: String
    },
    userName: { // 密码
        type: String
    },
    title: {
        type: String,
    },
    mainText: {
        type: String
    },
    responses: {
        type: Array
    },
    createTime: {
        type: String
    },
    lastUpdateTime: {
        type: String
    }
}, { collection: 'posts'});// mongoose always add a 's' after the name of collection if you do not have the second param,because mongoose always want to be smart

// 定义Model
let PostsModel = mongoose.model('posts', PostsSchema);

// 暴露接口
module.exports = PostsModel;