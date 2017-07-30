var express = require('express');

var router = express.Router();

// 导入首页的controller
var indexCtrl = require('../controller/indexCtrl.js');

router
    .get('/', indexCtrl.showIndexPage); // 加载首页

module.exports = router;