/**
 * Created by huhanwen on 2017/5/1.
 */
let mongoose = require('mongoose');

// 定义Schema
AdminSchema = new mongoose.Schema({
    adminUser: {// 用户名
        type: String
    },
    password: { // 密码
        type: String
    },
    jurisdiction: {//权限
        type: String
    }
}, { collection: 'admin'});// mongoose always add a 's' after the name of collection if you do not have the second param,because mongoose always want to be smart

// 定义Model
let AdminModel = mongoose.model('admin', AdminSchema);

// 暴露接口
module.exports = AdminModel;