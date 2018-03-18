// 注意：中间件的加载顺序很重要。
// 如下面设置静态文件目录的中间件应该放到 routes(app) 之前加载，这样静态文件的请求就不会落到业务逻辑的路由里；
// flash 中间件应该放到 session 中间件之后加载，因为 flash 是基于 session 实现的。
const path = require('path');
const express = require('express');
const session = require ('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const config = require('config-lite')(__dirname);   //找到根目录下的config配置目录，确定config模块
const routes = require('./routes');
const pkg = require('./package');
const winston = require('winston'); //使用 winston 和 express-winston 记录日志
const expressWinston = require('express-winston');  //日志分为正常请求的日志和错误请求的日志,两种日志都打印到终端并写入文件

const app = express();

// 使用__dirname变量获取当前模块文件所在目录的完整绝对路径，此处__dirname即为C:\Users\Shirley\Desktop\myblog
// path.join()用于拼接路径，path.join(__dirname, 'views')相当于C:\Users\Shirley\Desktop\myblog\views
// 设置模板的根目录
app.set('views', path.join(__dirname, 'views'));
// 设置模板引擎为ejs
app.set('view engine', 'ejs');

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// session中间件
app.use(session({
    name: config.session.key,   // 设置cookie中保存session ID的字段名称。表示cookie的name，默认cookie的name是：connect.sid。
    secret: config.session.secret,  //通过设置secret计算hash值，用来对session数据进行加密的字符串,并放在cookie中，使产生的signedCookie防篡改
    resave: true,   //强制更新session,指每次请求都重新设置session cookie，假设你的cookie是10分钟过期，每次请求都会再设置10分钟
    saveUninitialized: false,   //是指无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid。
    cookie: {
        maxAge: config.session.maxAge   //cookie过期时间，毫秒。过期后 cookie 中的 session id 自动删除
    },
    store: new MongoStore({ //将session存储到mongodb
        url: config.mongodb //mongodb地址
    })
}));

// flash中间件，用来显示通知
app.use(flash());

// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
    uploadDir: path.join(__dirname, 'public/img'),  // 上传文件目录
    keepExtensions: true    // 保留后缀
}));

// 设置模板全局变量
app.locals.blog = {
    title: pkg.name,
    description: pkg.description
};

// 添加模板必需的三个变量
// 在调用 res.render 的时候就不用传入这四个变量(即app.locals.blog变量和res.locals下面的三个变量)了，
// express 为我们自动 merge 并传入了模板，所以我们可以在模板中直接使用这四个变量。
app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});


// 正常请求的日志
app.use(expressWinston.logger({
  transports: [
    new (winston.transports.Console)({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/success.log'
    })
  ]
}));
// 路由
// 记录正常请求日志的中间件要放到 routes(app) 之前，记录错误请求日志的中间件要放到 routes(app) 之后
routes(app);
// 错误请求的日志
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/error.log'
    })
  ]
}));


// 将错误信息用页面通知展示。 用于处理用户权限或者要访问的文章不存在时的错误信息,
// express 有一个内置的错误处理逻辑，如果程序出错，会直接将错误栈返回并显示到页面上,
// 这里将错误信息用页面通知的形式告知用户
app.use(function (err, req, res, next) {
  console.error(err);
  req.flash('error', err.message);
  res.redirect('/posts');
});



// 直接启动 index.js 则会监听端口启动程序，如果 index.js 被 require 了，则导出 app，通常用于测试。
if (module.parent) {
  // 被 require，则导出 app
  module.exports = app;
} else {
  // 监听端口，启动程序
  app.listen(config.port, function () {
    console.log(`${pkg.name} listening on port ${config.port}`);
  });
}
