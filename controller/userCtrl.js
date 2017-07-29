// 导入 Model 模块
var UserModel = require('../model/userModel.js');

// 导入 MD5 第三方加密模块
var md5 = require("blueimp-md5");

// 导入 设置用户密码安全用到的 盐
var config = require('../config.js');

module.exports = {

    showRegisterPage(req, res) { // 展示注册页面
        res.render('./user/register', {});
    },

    registerNewUser(req, res) { // 注册新用户
        //1.获取到提交过来的用户信息 可以使用req.body方法获取post提交过来的数据 --> 注册中间件 --> body-parser 在 app.js 注册中间件
        var user = req.body;
        // 2. 根据提交过来的用户名，调用相关的 Model 模块，查询此用户名有没有被注册
        UserModel.getUserByName(user.username, (err, results) => {
            // console.log(err);
            if (err) return res.json({ err_code: 1, msg: '注册失败！' });
            // 判断查询出来的结果，length 如果等于0  表示此用户名可用
            if (results.length !== 0) return res.json({ err_code: 1, msg: '该户名已存在,请更换用户名！' });
            /*
              为了提高密码的安全性，我们需要在 注册新用户之前，先把用户的密码进行 MD5 加密
              调用 MD5 方法加密 
                    参数：>1. 用户输入的密码
                          >2. 程序执行提高安全的盐
            */
            user.password = md5(user.password, config.pwdSalt);
            UserModel.registerNewUser(user, (err, results) => {
                if (err) return res.json({ err_code: 1, msg: '注册失败！' });
                // 如果影响行数 不为 1，表示注册失败
                if (results.affectedRows !== 1) return res.json({ err_code: 1, msg: '注册失败！' });
                // 注册成功
                res.json({ err_code: 0 });
            });
        })
    },

    showLoginPage(req, res) { // 展示登录页面
        res.render('./user/login', {});
    },


    login(req, res) { // 用户登录
        // 1. 获取提交过来的登录信息
        var loginUser = req.body;
        // 2. 根据登录信息，调用 Model 模块，查询此用户是否存在 如果存在，返回登录成功，否则返回登录失败
        // 在登录之前，先对用户数的 明文密码进行 加盐 处理，然后再去数据库中匹配密码
        loginUser.password = md5(loginUser.password, config.pwdSalt);
        UserModel.login(loginUser, (err, results) => {
            // 登录失败的情况
            if (err || results.length !== 1) return res.json({ err_code: 1, msg: '登录失败，请稍后再试！' });

            // 在返回登录成功之前，先把登录的状态 和 登录用户的数据，保存到 Session 中
            // console.log(req.session); // 保存前
            // 当注册 session 中间件 OK之后，只要你能访问到 req 这个对象，那么就能访问到 req.session
            req.session.islogin = true; // 将登录成功的状态，保存到 req.session 中
            req.session.user = results[0]; // 将登录人的 信息对象，保存到 req.session 中

            // console.log(req.session); // 保存后

            // 登录Ok的情况
            res.json({ err_code: 0 });
        });
    },


    logout(req, res) { // 注销登录
        // 分析: 登录状态的保持，是通过 Session 技术实现的  直接调用 req.session.** 实现的

        /*req.session.islogin = null;
        req.session.user = null;*/

        // 调用 session.destroy()方法  可实现注销登录
        req.session.destroy((err) => {
            if (err) {
                res.redirect('/');
                return;
            } else {
                res.redirect('/');
            }
        })
    }
}