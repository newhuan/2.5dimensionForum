/**
 * Created by huhanwen on 2017/5/2.
 */
let mongoose = require('mongoose');

// 定义Schema
JurisdictionSchema = new mongoose.Schema({
    level: {// 用户名
        type: String
    },
    description: { // 密码
        type: String
    },
    jurisdiction: {//权限
        type: Array
    },
    createTime: {
        type: String
    },
    lastUpdateTime: {
        type: String
    }
}, { collection: 'jurisdictions'});// mongoose always add a 's' after the name of collection if you do not have the second param,because mongoose always want to be smart

// 定义Model
let JurisdictionModel = mongoose.model('jurisdictions', JurisdictionSchema);

// 暴露接口
module.exports = JurisdictionModel;