// 入口文件
// 导入 express 框架
var express = require('express');

// 导入 读取文件模块 fs
var fs = require("fs");

// 导入 路径模块 path
var path = require("path");

var ejs = require("ejs");

// 创建一个服务器
var app = express();

// 配置默认模板引擎
app.set("view engine", "ejs");
// 配置默认模板引擎的存放路径
app.set("views", "./views");

// 托管静态资源文件
app.use('/node_modules', express.static('node_modules'));


// 注册中间件 body-parser
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));


// 注册 Session 中间件
var session = require("express-session");
// 使用 app.use 把 Session 中间件注册到 当前的 Web 服务器当中
app.use(session({
    secret: "这是加密字符串！任意即可！", // 用来生成加密的内容
    resave: false,
    saveUninitialized: false
}))

/*
    需求: 实现自动注册路由模块
    实现思路:
        1. 使用 fs.readdir 读取 router 文件夹下的所有 路由模块 的名称
        2. 读取完毕之后，拼接每个路由模块的完整路径
        3. 拼接出完整的路径之后， forEach 循环，通过 app.use 来注册每一个路由模块
 */
//1. 导入首页路由
/*var indexRouter = require('./router/indexRouter.js');
app.use(indexRouter);
// 导入用户路由
var userRouter = require('./router/userRouter.js');
app.use(userRouter); 
*/

/* 2.
app.use(require('./router/indexRouter.js'));
app.use(require('./router/userRouter.js'));
 */

// 3.调用 fs.readdir 目标路径 下，所有符合的 路由模块 进行拼接(配置路由--router.js)
fs.readdir(path.join(__dirname, '/router'), (err, filenames) => {
    if (err) throw err;
    filenames.forEach(filename => {
        var filePath = path.join(__dirname, './router', filename);
        app.use(require(filePath));
    })
})



app.listen(3000, function() {
    console.log("http://127.0.0.1:3000");
})