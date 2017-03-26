/**
 * Created by huhanwen on 2017/3/19.
 */

let mongoose = require('mongoose');

// 定义Schema
UserSchema = new mongoose.Schema({
    user: {// 真实姓名
        type: String
    },
    password: { // 密码
        type: String
    },
    responses: {
        type: Array,
        // default: []
    },
    posts: {
        type: Array
    },
    photo: {
        type: String
    }
}, { collection: 'user'});// mongoose always add a 's' after the name of collection if you do not have the second param,because mongoose always want to be smart

// 定义Model
let UserModel = mongoose.model('user', UserSchema);

// 暴露接口
module.exports = UserModel;