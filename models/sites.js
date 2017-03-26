/**
 * Created by huhanwen on 2017/3/26.
 */
let mongoose = require('mongoose');

// 定义Schema
SiteSchema = new mongoose.Schema({
    id: {// site id
        type: String
    },
    domainName: { //
        type: String
    },
    name: {
        type: String,
    }
}, { collection: 'sites'});// mongoose always add a 's' after the name of collection if you do not have the second param,because mongoose always want to be smart

// 定义Model
let SiteModel = mongoose.model('sites', SiteSchema);

// 暴露接口
module.exports = SiteModel;