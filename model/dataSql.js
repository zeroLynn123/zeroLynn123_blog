// 通过安装第三方的 mysql 模块  能够在 Node 中 链接上 MySQL数据库 并进行数据的 CRUD
var mySql = require("mysql");

var connection = mySql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'lynn_blogsql'
});

module.exports = connection;