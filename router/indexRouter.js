var express = require('express');

// 创建路由
var router = express.Router();

// 导入首页的 controller
var indexCtrl = require("../controller/indexCtrl.js");

router
    .get("/", indexCtrl.showIndexPage);


module.exports = router;