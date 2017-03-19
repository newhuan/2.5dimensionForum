/**
 * Created by huhanwen on 2017/3/19.
 */
let mongoose = require("mongoose");

let db = mongoose.connect("mongodb://127.0.0.1:27017/db_helloworld");

db.connection.on("error", function (error) {
    console.log("数据库连接失败：" + error);
});

db.connection.on("open", function () {
    console.log("数据库连接成功");
});