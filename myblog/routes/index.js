module.exports = function(app) {
    app.get('/', function(req, res) {   //默认路由，重定向到文章操作功能路由
        res.redirect('/posts');
    });
    app.use('/signup', require('./signup'));    //注册功能路由
    app.use('/signin', require('./signin'));    //登录功能路由
    app.use('/signout', require('./signout'));  //登出功能路由
    app.use('/posts', require('./posts'));      //文章操作功能路由
    app.use('/comments', require('./comments'));    //评论功能路由
    // 404 NOT FOUND
    app.use(function (req, res) {
      // res.headersSent是一个boolean值,在res对象发送后会变为true，如果没有res对象响应客户端请求，就发送404页面
      if (!res.headersSent) {
        res.status(404).render('404');
      }
    });
};
