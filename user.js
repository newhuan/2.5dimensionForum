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
    shopCar: {
        type: Array
    }
});

// 定义Model
let UserModel = mongoose.model('user', UserSchema);

// 暴露接口
module.exports = UserModel;