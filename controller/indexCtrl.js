var ArticleModel = require('../model/articleModel.js');

module.exports = {
    showIndexPage(req, res) { // 渲染首页页面
        // 在渲染首页的时候，先获取到所有的文章列表，交给首页渲染
        // 当前的页码值
        var nowPage = parseInt(req.query.page) || 1;
        // 每页显示的记录条数
        var pageSize = 4;
        // 根据页码和pageSize 查询数据
        ArticleModel.getArticlesByPage(nowPage, pageSize, (err, results) => {
            if (err) return res.send("<h2 style='text-align:center;margin-top:100px;'>错误编码500. 请链接当地服务器！</h2>");
            // 总记录条数
            var totalCount = results[1][0]['totalCount'];
            // 总页数：
            var totalPage = Math.ceil(totalCount / pageSize);
            // 渲染首页
            res.render('index', {
                islogin: req.session.islogin, // 从 session 中获取用户是否登录
                user: req.session.user, // 从 session 中获取用户信息
                list: results[0], // 所有文章数据
                totalPage: totalPage,
                nowPage: nowPage
            });
        });

    }
}