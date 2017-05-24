/**
 * Created by newhuan on 2017/5/24.
 */
let mongoose = require('mongoose');
// 定义Schema
TypeSchema = new mongoose.Schema({
    type: {// 类型
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
}, { collection: 'types'});// mongoose always add a 's' after the name of collection if you do not have the second param,because mongoose always want to be smart

// 定义Model
let TypeModel = mongoose.model('types', TypeSchema);

// 暴露接口
module.exports = TypeModel;