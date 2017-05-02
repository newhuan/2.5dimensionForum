/**
 * Created by huhanwen on 2017/5/2.
 */
let mongoose = require('mongoose');

// 定义Schema
OperationSchema = new mongoose.Schema({
    id: {// 操作id
        type: String
    },
    description: { // 描述
        type: String
    },
    createTime: {
        type: String
    },
    lastUpdateTime: {
        type: String
    }
}, { collection: 'operations'});// mongoose always add a 's' after the name of collection if you do not have the second param,because mongoose always want to be smart

// 定义Model
let OperationModel = mongoose.model('operations', OperationSchema);

// 暴露接口
module.exports = OperationModel;