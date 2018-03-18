# 使用 Express + MongoDB 搭建多人博客

来自[《一起学 Node.js》 ](https://github.com/nswbmw/N-blog)。
## MongoDB的安装使用 ##
参考博客 [学习MongoDB 一：MongoDB 入门（安装与配置）](http://blog.csdn.net/congcong68/article/details/44277469)。

存放数据和日志的文件夹放在了C:\data下，其中C:\data\db存放数据，C:\data\log存放日志。

**启动MongoDB服务和客户端**
cd到bin文件夹下，先启动服务器mongod(此时的DOS命令界面不要关)，再启动客户端mongo(新开一个DOS命令界面)。

当把运行MongoDB服务器的dos命令界面关掉，这样就不能链接MongoDB，需要像mySql那样，添加到Windows Service，然后在命令行上启动服务和关闭服务。(已将MongoDB添加到Windows Service)

cd到bin文件夹下，`net start MongoDB` 启动MongoDB服务， `net stop MongoDB` 关闭MongoDB服务。启动服务之后就可以cd到bin文件夹下，直接使用mongo命令启动客户端。

## Express安装使用 ##
### supervisor ###
在开发过程中，每次修改代码保存后，我们都需要手动重启程序，才能查看改动的效果。使用 supervisor 可以解决这个繁琐的问题，全局安装 supervisor：`npm i -g supervisor`

运行 `supervisor --harmony index` 启动程序，supervisor 会监听当前目录下 node 和 js 后缀的文件，当这些文件发生改动时，supervisor 会自动重启程序。（类似于重新启动 node index）

### express.Router ###
在实际开发中通常有几十甚至上百的路由，如果都写在 index.js 既臃肿又不好维护，这时可以使用 express.Router 实现更优雅的路由解决方案。

每个路由文件通过生成一个 express.Router 实例 router 并导出，通过 app.use (放在index.js中)挂载到不同的路径。这两种代码实现了相同的功能，但在实际开发中推荐使用 express.Router 将不同的路由分离到不同的路由文件中，然后在在主入口模块即index.js中引入不同的路由模块，再通过app.use挂载。

在不同的路由配置模块中，可以根据相应的请求路径，动态渲染相应的模板。比如在以下代码就是在routes/users.js路由配置模块中，根据请求路径中用户名的不同，动态渲染模板文件views/users.ejs

``` js
	const express = require('express');
	const router = express.Router();
	router.get('/:name', function(req, res) {
	    // 通过调用 res.render 函数渲染 ejs 模板，res.render 第一个参数是模板的名字
	    // 这里是 users 则会匹配 views/users.ejs，第二个参数是传给模板的数据
	    // res.render 的作用就是将模板和数据结合生成 html，同时设置响应头中的 Content-Type: text/html，
	    // 告诉浏览器我返回的是 html，不是纯文本，要按 html 展示。
	    res.render('users', {
	        name: req.params.name
	    });
	});
	module.exports = router;
```
## ejs模板引擎 ##
模板引擎（Template Engine）是一个将页面模板和数据结合起来生成 html 的工具。模板引擎有很多，ejs 是其中一种，因为它使用起来十分简单，而且与 express 集成良好，所以我们使用 ejs。Express的模板引擎常用的是ejs和jade。它预留了变量，res.render()就是将我们的数据填充到模板后展示出完整的页面。

安装ejs: `npm i ejs --save`

ejs 有 3 种常用标签：

    <% code %>：运行 JavaScript 代码，不输出
    <%= code %>：显示转义后的 HTML内容
    <%- code %>：显示原始 HTML 内容

**注意：**`<%= code %>` 和 `<%- code %>` 都可以是 JavaScript 表达式生成的字符串，当变量 code 为普通字符串时，两者没有区别。当 code 比如为 `<h1>hello</h1>` 这种字符串时，`<%= code %>` 会原样输出 `<h1>hello</h1>`，而 `<%- code %>` 则会显示 H1 大的 hello 字符串。

例如以下：

``` html
	<div><%= '<h2>test1</h2>' %></div>
	<div><%- '<h2>test2</h2>' %></div>
```
输出样式如下图：

![test](http://ou3oh86t1.bkt.clouddn.com/demo/express-mongoDB-ejs/iamges/test.png)

使用模板引擎通常不是一个页面对应一个模板，这样就失去了模板的优势，而是把模板拆成可复用的模板片段组合使用，如在 views 下新建 header.ejs 和 footer.ejs，并修改 主模板users.ejs,将原来的 users.ejs 拆成出了 header.ejs 和 footer.ejs，并在 主模板users.ejs 通过 ejs 内置的 include 方法引入，即在主模板通过以下两个命令`<%- include('header') %>` 以及 `<%- include('footer') %>`引入两个拆分的模板文件，从而实现了跟以前一个模板文件相同的功能。

拆分模板组件通常有两个好处：模板可复用，减少重复代码； 主模板结构清晰。

**补充：** `res.render(file,option)`是express中专门渲染视图用的，首先要在你的app.js或者index.js中设置一下渲染引擎，比如html,jade,ejs(我自己使用的)，mustache等。然后将视图模板的文件位置放入file,将传入的模板数据放入option对象中，模板引擎就能自己渲染出视图。

##  express中间件 ##
[Express 中间件与 next](https://github.com/nswbmw/N-blog/blob/master/book/3.4%20Express%20%E6%B5%85%E6%9E%90.md)

express 中的中间件（middleware）就是用来处理请求的，通过 app.use 加载中间件，当一个中间件处理完，可以通过调用 next() 传递给下一个中间件，如果没有调用 next()，则请求不会往下传递，如内置的 res.render 其实就是渲染完 html 直接返回给客户端，没有调用 next()，从而没有传递给下一个中间件。

[node.js-express的app.use()初步理解](https://www.cnblogs.com/fydxx/p/6707875.html)

[[node]express中app.use和app.get的区别及解析](http://blog.csdn.net/wthfeng/article/details/53366169)

当有多条路由规则时，可用`app.use(path,router)`定义的，router代表一个由`express.Router()`创建的对象，在路由对象中可定义多个路由规则。可是如果我们的路由只有一条规则时，可直接接一个回调作为简写如`app.use([path,] function(req, res, next) {})`，也可直接使用`app.get([path,] function(req, res, next) {})`或`app.post([path,] function(req, res, next) {})`方法。

	const express = require('express');
	const app = express();
	
	app.use(function(req, res, next) {
	    console.log('1');
	    next();
	    console.log('111');
	});
	app.use(function(req, res, next) {
	    console.log('2');
	    res.status(200).end();
	});
	app.listen(3000);
	//访问localhost:3000 终端输出
	1
	2
	111
通过 app.use 加载中间件，在中间件中通过 next 将请求传递到下一个中间件，next 可接受一个参数接收错误信息，如果使用了 next(error)，则会返回错误而不会传递到下一个中间件。

[关于app.use使用的官方文档](http://expressjs.com/en/4x/api.html#app.use)。

注意：中间件的加载顺序很重要！比如：通常把日志中间件放到比较靠前的位置。

## 目录结构 ##
创建 myblog，运行 `npm init`，执行完`npm init`后，在myblog文件夹下会增加一个package.json文件，里面描述了项目名称、版本、对此项目的描述信息、程序的主入口、依赖、作者、license等信息。

在 myblog 目录下创建以下目录及空文件（package.json 除外）：

![项目目录结构示意图](http://ou3oh86t1.bkt.clouddn.com/demo/express-mongoDB-ejs/iamges/catelog.png)

    models: 存放操作数据库的文件
    public: 存放静态文件，如样式、图片等
    routes: 存放路由文件
    views: 存放模板文件
    index.js: 程序主文件
    package.json: 存储项目名、描述、作者、依赖等等信息

遵循了 MVC（ 模型(model)－视图(view)－控制器(controller/route) )的开发模式。

### 安装的依赖 ###
安装的依赖：
	
	npm i config-lite connect-flash connect-mongo ejs express express-formidable express-session marked moment mongolass objectid-to-timestamp sha1 winston express-winston --save

对应模块的用处：

    express: web 框架
    express-session: session 中间件
    connect-mongo: 将 session 存储于 mongodb，结合 express-session 使用
    connect-flash: 页面通知的中间件，基于 session 实现
    ejs: 模板
    express-formidable: 接收表单及文件上传的中间件
    config-lite: 读取配置文件
    marked: markdown 解析
    moment: 时间格式化
    mongolass: mongodb 驱动
    objectid-to-timestamp: 根据 ObjectId 生成时间戳
    sha1: sha1 加密，用于密码加密
    winston: 日志
    express-winston: express 的 winston 日志中间件
### ESLint ###
**注意此处修改了eslint的默认配置。**

全局安装eslint命令：  `npm i eslint -g`，然后运行以下命令初始化eslint配置(即修改eslint的默认配置，默认是javascript)：`eslint --init`，依次选择：

	-> Use a popular style guide
	-> Standard
	-> JSON

eslint 会创建一个 .eslintrc.json 的配置文件，同时自动安装并添加相关的模块到 devDependencies。这里我们使用 Standard 规范，其主要特点是不加分号。

### EditorConfig扩展插件 ###
EditorConfig 是一个保持缩进风格的一致的工具，当多人共同开发一个项目的时候，往往会出现每个人用不同编辑器的情况，而且有的人用 tab 缩进，有的人用 2 个空格缩进，有的人用 4 个空格缩进，EditorConfig 就是为了解决这个问题而诞生。

VS Code 插件名称为：EditorConfig for VS Code。

在 myblog 目录下新建 .editorconfig 的文件，添加内容如下：
	
	# editorconfig.org
	root = true
	
	[*]
	indent_style = space
	indent_size = 2
	end_of_line = lf
	charset = utf-8
	trim_trailing_whitespace = true
	insert_final_newline = true
	tab_width = 2
	
	[*.md]
	trim_trailing_whitespace = false
	
	[Makefile]
	indent_style = tab
使用 2 个空格缩进，tab 长度也是 2 个空格。trim_trailing_whitespace 用来删除每一行最后多余的空格，insert_final_newline 用来在代码最后插入一个空的换行。

## 配置文件---配置与代码分离 ##
不管是小项目还是大项目，将配置与代码分离是一个非常好的做法。通常将配置写到一个配置文件里，如 config.js 或 config.json ，并放到项目的根目录下。但实际开发时会有许多环境，如本地开发环境、测试环境和线上环境等，不同环境的配置不同（如：MongoDB 的地址），不可能每次部署时都要去修改引用 config.test.js 或者 config.production.js。因此 **[config-lite 模块](https://github.com/nswbmw/N-blog/blob/master/book/4.3%20%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6.md)**正是解决此类问题。

config-lite 是一个轻量的读取配置文件的模块，会根据环境变量（`NODE_ENV`）的不同加载 config 目录下不同的配置文件。如果不设置 `NODE_ENV`，则读取默认的 default 配置文件，如果设置了 `NODE_ENV`，则会合并指定的配置文件和 default 配置文件作为配置，config-lite 支持 .js、.json、.node、.yml、.yaml 后缀的文件。

config-lite读取配置文件的流程：

如果程序以 `NODE_ENV=test node app` 启动，则 config-lite 会依次降级查找 `config/test.js`、`config/test.json`、`config/test.node`、`config/test.yml`、`config/test.yaml` 并合并 default 配置; 如果程序以 `NODE_ENV=production node app` 启动，则 config-lite 会依次降级查找 `config/production.js`、`config/production.json`、`config/production.node`、`config/production.yml`、`config/production.yaml` 并合并 default 配置。

##  功能与路由设计 ##
1、注册：

    注册页：GET /signup
    注册（包含上传头像）：POST /signup
2、登录：

    登录页：GET /signin
    登录：POST /signin
3、登出： `GET /signout`
4、查看文章：

    主页：GET /posts
    个人主页：GET /posts?author=xxx
    查看一篇文章（包含留言）：GET /posts/:postId
5、发表文章：

    发表文章页：GET /posts/create
    发表文章：POST /posts/create
6、修改文章：

    修改文章页：GET /posts/:postId/edit
    修改文章：POST /posts/:postId/edit
7、删除文章：	`GET /posts/:postId/remove`
8、留言：

    创建留言：POST /comments
    删除留言：GET /comments/:commentId/remove
此博客页面是用后端渲染的，所以只通过简单的 `<a>(GET)` 和 `<form>(POST)` 与后端进行交互，如果使用 jQuery 或者其他前端框架（如 Angular、Vue、React 等等）可通过 Ajax 与后端交互，则 api 的设计应尽量遵循 Restful 风格。

**关于Restful**

Restful 是一种 api 的设计风格，提出了一组 api 的设计原则和约束条件。
如上面删除文章的路由设计：`GET /posts/:postId/remove`
Restful 风格的设计：`DELETE /posts/:postId`
可以看出，Restful 风格的 api 更直观且优雅。

### 会话 ###
由于 HTTP 协议是无状态的协议，所以服务端需要记录用户的状态时，就需要用某种机制来识别具体的用户，这个机制就是会话（Session）。
cookie 与 session 的区别：

    cookie 存储在浏览器（有大小限制），session 存储在服务端（没有大小限制）
    通常 session 的实现是基于 cookie 的，session id 存储于 cookie 中
    session 更安全，cookie 可以直接在浏览器查看甚至编辑
通过引入 express-session 中间件实现对会话的支持：`app.use(session(options))`
session 中间件会在 req 上添加 session 对象，即 req.session 初始值为 `{}`，当登录后设置 `req.session.user = 用户信息`，返回浏览器的头信息中会带上 `set-cookie` 将 session id 写到浏览器 cookie 中，那么该用户下次请求时，通过带上来的 cookie 中的 session id 我们就可以查找到该用户，并将用户信息保存到 `req.session.user`。

### 页面通知 ###
页面通知的需求：

当我们操作成功时需要显示一个成功的通知，如登录成功跳转到主页时，需要显示一个 `登陆成功` 的通知；当我们操作失败时需要显示一个失败的通知，如注册时用户名被占用了，需要显示一个 用户名已占用 的通知。通知只显示一次，刷新后消失，我们可以通过 **[connect-flash](https://www.npmjs.com/package/connect-flash)** 中间件实现这个功能。

connect-flash 是基于 session 实现的，它的原理：设置初始值` req.session.flash={}`，通过 `req.flash(name, value)` 设置这个对象下的字段和值，通过 `req.flash(name)` 获取这个对象下的值，同时删除这个字段，实现了只显示一次刷新后消失的功能。

**express-session、connect-mongo 和 connect-flash 的区别与联系:**

    express-session: 会话（session）支持中间件
    connect-mongo: 将 session 存储于 mongodb，需结合 express-session 使用，我们也可以将 session 存储于 redis，如 connect-redis
    connect-flash: 基于 session 实现的用于通知功能的中间件，需结合 express-session 使用
### 权限控制 ###
不管是论坛还是博客网站，我们没有登录的话只能浏览，登陆后才能发帖或写文章，即使登录了你也不能修改或删除其他人的文章，这就是权限控制。

如何实现页面的权限控制：

可以把用户状态的检查封装成一个中间件，在每个需要权限控制的路由加载该中间件，即可实现页面的权限控制。在 myblog 下新建 middlewares 目录，在该目录下新建 check.js。
### 补充 ###
(1)**__dirname**

在任何模块文件内部，可以使用[__dirname变量获取当前模块文件所在目录的完整绝对路径](http://blog.csdn.net/u013864585/article/details/45974427)，桌面上根目录myblog下的index.js文件中的`__dirname`即为`C:\Users\Shirley\Desktop\myblog`。

`app.set('views', path.join(__dirname, 'views')); `用于设置模板的根目录，此处模板的根目录名称为`views`，路径为`C:\Users\Shirley\Desktop\myblog\views`。 `path.join('/a','/b')`将路径进行拼接，相当于路径`a/b`。

(2) ES6中的模板字符串

参考[阮一峰-ES6入门模板字符串篇](http://es6.ruanyifeng.com/#docs/string#%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2)。例如在根目录下的index.js文件中的以下语句：

	// 监听端口，启动程序
	app.listen(config.port, function() {
	    console.log(`${pkg.name} listening on port ${config.port}`);
	});
其中console.log小括号里那一坨就表示模板字符串，模板字符串用反引号表示。如果在模板字符串中需要使用反引号，则前面要用反斜杠转义。`${}`表示模板字符串中嵌入的变量名。

模板字符串（template string）是增强版的字符串，用反引号（`）标识。它可以当作普通字符串使用，也可以用来定义多行字符串，或者在字符串中嵌入变量。

## 前端页面设计 ##
使用 jQuery + Semantic-UI 实现前端页面的设计。

关于[Semantic UI 与 Bootstrap的对比](http://ju.outofmemory.cn/entry/50894)：Semantic-UI比Bootstrap更语义化，使用了更容易理解的标签名称：导航的是nav，主要内容的是main，class名也很明确，而且不像Bootstrap需要套很多层。Bootstrap很通用，兼容性很好，甚至能兼容低版本的IE，Semantic-UI则更Geek，有不少CSS3的特性，比如Shape和Reveal就很有趣。从界面设计风格来说，Semantic比Bootstrap(2)更扁平化。

将模板拆分成一些组件，然后使用 ejs 的 include 方法将组件组合起来进行渲染，主页模板拆分示意图如下：

![主页模板拆分](http://ou3oh86t1.bkt.clouddn.com/demo/express-mongoDB-ejs/images/%E4%B8%BB%E9%A1%B5%E6%A8%A1%E6%9D%BF%E7%BB%84%E4%BB%B6%E6%8B%86%E5%88%86.png)

文章页模板拆分示意图如下：

![文章页模板拆分](http://ou3oh86t1.bkt.clouddn.com/demo/express-mongoDB-ejs/images/%E6%96%87%E7%AB%A0%E9%A1%B5%E7%BB%84%E4%BB%B6%E6%8B%86%E5%88%86.png)

express 中有两个对象可用于模板的渲染：app.locals 和 res.locals，ejs 模板中用到了 blog、user、success、error 变量，我们将 blog 变量挂载到 app.locals 下，将 user、success、error 挂载到 res.locals 下。

**express/lib/response.js**

	res.render = function render(view, options, callback) {
	  var app = this.req.app;
	  var opts = options || {};
	  ...
	  // merge res.locals
	  opts._locals = self.locals;
	  ...
	  // render
	  app.render(view, opts, done);
	};
**express/lib/application.js**

	app.render = function render(name, options, callback) {
	  ...
	  var opts = options;
	  var renderOptions = {};
	  ...
	  // merge app.locals
	  merge(renderOptions, this.locals);
	
	  // merge options._locals
	  if (opts._locals) {
	    merge(renderOptions, opts._locals);
	  }
	
	  // merge options
	  merge(renderOptions, opts);
	  ...
	  tryRender(view, renderOptions, done);
	};
在调用 `res.render` 的时候，express 合并（merge）了 3 处的结果后传入要渲染的模板，优先级：`res.render` 传入的对象> `res.locals` 对象 > `app.locals` 对象，所以 `app.locals` 和 `res.locals` 几乎没有区别，都用来渲染模板，使用上的区别在于：`app.locals` 上通常挂载常量信息（如博客名、描述、作者这种不会变的信息），`res.locals` 上通常挂载变量信息，即每次请求可能的值都不一样（如请求者信息，`res.locals.user = req.session.user`）。

## 连接数据库 ##
使用 [Mongolass](https://github.com/nswbmw/N-blog/blob/master/book/4.6%20%E8%BF%9E%E6%8E%A5%E6%95%B0%E6%8D%AE%E5%BA%93.md) 这个模块操作 mongodb 进行增删改查, Mongolass是一个 mongodb 的驱动库，其他的还有node-mongodb-native、Mongoose。

## 注册 ##
### 用户模型设计 ###
只存储用户的名称、密码（Hash加密后的）、头像、性别和个人简介这几个字段。(Mongolass 中的 model 你可以认为相当于 mongodb 中的 collection，只不过添加了插件的功能。)

在lib/mongo.js模块中，定义存储的用户信息模式(即用户表的 schema，定义了字段及字段的类型、是否必需等，相当于一个collection模型)。如下所示：

	exports.User = mongolass.model('User', {
	  name: { type: 'string', required: true },
	  password: { type: 'string', required: true },
	  avatar: { type: 'string', required: true },
	  gender: { type: 'string', enum: ['m', 'f', 'x'], default: 'x' },
	  bio: { type: 'string', required: true }
	})
	exports.User.index({ name: 1 }, { unique: true }).exec()// 根据用户名找到用户，用户名全局唯一
其中`required: true` 表示该字段是必需的，`default: xxx` 用于创建文档时设置默认值。

`exports.User.index({ name: 1 }, { unique: true }).exec()`表示建立了按name正序排列的索引，并且不能重复。

**此处遇到的问题：**

在写完注册页的视图模板，访问`localhost:3000/signup`时，一直显示正在等待localhost，却没有返回页面，经检查发现，在路由配置文件routes/signup.js中，`router.get('/', checkNotLogin, function (req, res, next)`中，是检查用户登录状态的中间件`checkNotLogin`出了问题，导致第二个回调函数无法执行渲染注册页面。具体的就是在middlewares/check/check.js中，对用户的状态检查完了之后忘记写`next()`了，导致`router.get()`后面的回调函数无法执行，一直在等待响应。

**middlewares/check/check.js：**

	// 用于用户状态检查的中间件，在每个需要权限控制的路由加载该中间件，即可实现页面的权限控制
	module.exports = {
	    checkLogin: function checkLogin(req, res, next) {   //检查用户是否登录，用于需要用户登录才能操作的页面
	        if (!req.session.user) {    //如果会话中没有储存该用户信息，则该用户未登录
	            req.flash('error', '未登录');  //显示 "未登录" 的通知
	            return res.redirect('/signin');     //跳转到登录页
	        }
	        // 一定要记得加next()，否则请求不会往下传递，无法继续执行例如 router.get('/', checkNotLogin, function(req, res, next)中的第二个回调函数
	        next(); 
	    },
	    checkNotLogin: function checkNotLogin(req, res, next) {     //检查用户是否登录，已登录用户就禁止访问登录、注册页面
	        if (req.session.user) {     //如果会话中储存有该用户信息，则说明该用户已登录
	            req.flash('error', '已登录');  ////显示 "已登录" 的通知
	            return res.redirect('back');    //返回登录之前在浏览的页面
	        }
	        next();
	    }
	};
### 注册时上传 头像文件 ###
使用 express-formidable 处理 form 表单（包括文件上传。

在根目录的index.js下添加如下代码：

	// 处理表单及文件上传的中间件
	app.use(require('express-formidable')({
	  uploadDir: path.join(__dirname, 'public/img'), // 上传文件目录
	  keepExtensions: true// 保留后缀
	}))

**注意缺陷！！！：**

对于用户名、密码、头像等等的注册信息全部是在提交以后在服务端校验的，实际生产中，部分表单校验(例如用户名的字符数，两次输入密码是否一致等检查)应该在客户端完成，避免不必要的向服务器发请求。

## 登录功能逻辑实现 ##
首先修改[登录页](https://github.com/nswbmw/N-blog/blob/master/book/4.8%20%E7%99%BB%E5%87%BA%E4%B8%8E%E7%99%BB%E5%BD%95.md)的路由设置 `routes/signin.js`，如下：

	router.get('/', checkNotLogin, function (req, res, next) {
	  res.render('signin')
	})
然后设计登录页的视图模板 `views/signin.ejs`，最后实现登录的逻辑。

登录逻辑的实现：修改 `models/users.js` 添加 `getUserByName` 方法用于通过用户名获取用户信息， 使用了 `addCreatedAt` 自定义插件（通过 `_id` 生成时间戳），修改 lib/mongo.js。

`mongolass.plugin(pluginName, hooks);// 注册全局插件`

	mongolass.plugin('addCreateAt', { 
	    afterFind: function(results) {
	        results.forEach(function(item) {
	            item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
	        });
	        return results;
	    },
	    afterFindOne: function(result) {
	        if (result) {
	            result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
	        }
	        return result;
	    }
	});
关于`_id`参考博客[【Mongodb】_id和ObjectId详解！](http://blog.csdn.net/after_you/article/details/66971680)。MongoDB 中存储的文档必须有一个`_id` 键。这个键的值可以是任何类型的，默认是个ObjectId 对象。在一个集合里面，每个文档都有唯一的`_id` 值，来确保集合里面每个文档都能被唯一标识。如果有两个集合的话，两个集合可以都有一个值为123 的`_id` 键，但是每个集合里面只能有一个`_id` 是123 的文档。

在 POST /signin 的路由处理函数中，通过传上来的 name 去数据库中找到对应用户，校验传上来的密码是否跟数据库中的一致。不一致则返回上一页（即登录页）并显示『用户名或密码错误』的通知，一致则将用户信息写入 session，跳转到主页并显示『登录成功』的通知。

## 文章模型设计 ##
只存储文章的作者 id、标题、正文和点击量这几个字段，对应修改 lib/mongo.js，创建Post的collection schema。。然后创建发表文章页的视图模型 views/create.ejs，在routes/posts.js路由模块下修改发表文章页的路由。然后创建 models/posts.js 用来存放与文章操作相关的代码，然后再在 routes/posts.js路由模块下继续修改发表一篇文章的路由，并在路由处理的时候进行表单字段的校验，然后将文章信息插入数据库，成功后跳转到该文章页并显示『发表成功』的通知，失败后请求会进入错误处理函数。

接下来实现[主页与文章页](https://github.com/nswbmw/N-blog/blob/master/book/4.9%20%E6%96%87%E7%AB%A0.md)。使用了 markdown 解析文章的内容，所以在发表文章的时候可使用 markdown 语法（如插入链接、图片等等）,所以在models/posts.js中需要引入模块 `const marked = require('marked')`。在 PostModel 上注册了 contentToHtml，而 addCreatedAt 是在 lib/mongo.js 中 mongolass 上注册的。也就是说 contentToHtml 只针对 PostModel 有效，而 addCreatedAt 对所有 Model 都有效。

再接下来创建设置文章详情页，views/post.ejs，然后修改routes/posts.js下获取一篇文章详情的路由配置。

再接下来实现编辑与删除文章，修改 models/posts.js，在 module.exports 对象上添加 3 个方法，分别是 `getRawPostById`（通过文章 id 获取一篇原生文章,用于编辑，即转化为html之前的.md形式的内容），`updatePostById`(通过文章 id 更新一篇文章，即根据文章id更新数据库的Post集合中对应的文档)，`delPostById`(通过文章 id 删除一篇文章,即根据文章id删除数据库的Post集合中对应的文档)。

## 留言设计 ##
### 留言模型设计 ###
只需要留言的作者 id、留言内容和关联的文章 id 这几个字段。修改 lib/mongo.js，增加Comment集合。如下：

	exports.Comment = mongolass.model('Comment', {
	  author: { type: Mongolass.Types.ObjectId, required: true },
	  content: { type: 'string', required: true },
	  postId: { type: Mongolass.Types.ObjectId, required: true }
	})
	exports.Comment.index({ postId: 1, _id: 1 }).exec()// 通过文章 id 获取该文章下所有留言，按留言创建时间升序

### 显示留言 ###
在实现留言功能之前，先让文章页可以显示留言列表。首先创建留言的模板，views/components/comments.ejs。再在文章页引入留言的模板片段，修改 views/post.ejs 。再创建models/comments.js，存放留言相关的数据库操作。然后再设置留言的路由操作routes/comments.js。

## 404页面 ##
首先新建 views/404.ejs，用于创建404视图模板，用了腾讯的公益404。
然后在routes/index.js中添加处理服务器无法正常提供信息，或是服务器无法回应且不知原因的路由处理。

	// 404 page
	app.use(function (req, res) {
	  if (!res.headersSent) {
	    res.status(404).render('404')
	  }
	})

## 错误页面 ##
xpress 有一个内置的错误处理逻辑，如果程序出错，会直接将错误栈返回并显示到页面上。在根目录的index.js中添加以下代码
	
	app.use(function (err, req, res, next) {
	  console.error(err)
	  req.flash('error', err.message)
	  res.redirect('/posts')
	})
用于错误信息用页面通知展示，刷新页面将会跳转到主页并显示对应的红色通知。

## 日志 ##
日志分为正常请求的日志和错误请求的日志，实现这两种日志都打印到终端并写入文件。使用 winston 和 express-winston 记录日志。
新建 logs 目录存放日志文件，修改 index.js引入上述两个依赖。并在根目录的index.js中，修改路由部分为：

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
	}))
	// 路由
	routes(app)
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
	}))
winston 将正常请求的日志打印到终端并写入了 logs/success.log，将错误请求的日志打印到终端并写入了 logs/error.log。记录正常请求日志的中间件要放到 routes(app) 之前，记录错误请求日志的中间件要放到 routes(app) 之后。

**.gitignore**
想把项目托管到 git 服务器上（如: GitHub），而不想把线上配置、本地调试的 logs 以及 node_modules 添加到 git 的版本控制中，这个时候就需要 .gitignore 文件了，git 会读取 .gitignore 并忽略这些文件。在 myblog 下新建 .gitignore 文件，添加如下配置：

	config/*
	!config/default.*
	npm-debug.log
	node_modules
	coverage
通过设置：

	config/*
	!config/default.*
只有 config/default.js 会加入 git 的版本控制，而 config 目录下的其他配置文件则会被忽略，因为把线上配置加入到 git 是一个不安全的行为，通常你需要本地或者线上环境手动创建 config/production.js，然后添加一些线上的配置（如：mongodb 配置）即可覆盖相应的 default 配置。

分别在 public/img 目录和logs 目录下创建以下内容的 .gitignore

	# Ignore everything in this directory
	*
	# Except this file
	!.gitignore
git 会忽略 public/img 目录下所有上传的头像，而不忽略 public/img 目录。

## 测试 ##

**mocha**8(Mocha是一个优秀的JavaScript测试框架,提供了各种style的测试报告。结合supertest使用，可以让我们的API测试报告可视化上一个档次) 和 **suptertest** (supertest是一个非常棒的适用于node的模拟HTTP请求的库)是常用的测试组合，通常用来测试 restful 的 api 接口。

首先安装所需模块:	`npm i mocha supertest --save-dev`。修改 package.json的test字段：

	"scripts": {
	  "test": "mocha test"
	}
指定执行 test 目录的测试。修改 根目录下index.js的监听端口启动程序部分：

	if (module.parent) {
	  // 被 require，则导出 app
	  module.exports = app
	} else {
	  // 监听端口，启动程序
	  app.listen(config.port, function () {
	    console.log(`${pkg.name} listening on port ${config.port}`)
	  })
	}
这样做可以实现：直接启动 index.js 则会监听端口启动程序，如果 index.js 被 require 了，则导出 app，通常用于测试。

找一张图片用于测试上传头像，放到 test 目录下，如 avatar.jpg。新建 test/signup.js的测试代码，运行 npm test进行测试。

**测试覆盖率**
直观的看出测试是否覆盖了所有的代码，这就是测试覆盖率，即被测试覆盖到的代码行数占总代码行数的比例。istanbul 是一个常用的生成测试覆盖率的库，它会将测试的结果报告生成 html 页面，并放到项目根目录的 coverage 目录下。

首先安装 istanbul: `npm i istanbul --save-dev`，然后将package.json的test字段修改：

"scripts": {
  "test": "istanbul cover node_modules/mocha/bin/_mocha" //windows系统下
}
即可将 istanbul 和 mocha 结合使用，运行 npm test，终端会打印。打开 myblog/coverage/Icov-report/index.html，可以可视化看到代码文件具体的覆盖率。

## 部署 ##
**MLab** (前身是 MongoLab) 是一个 mongodb 云数据库提供商，我们可以选择 500MB 空间的免费套餐用来测试。分配给我们的一个mongodb url。新建 config/production.js，添加：

	module.exports = {
	  mongodb: mongodb url
	}
停止程序，然后以 production 配置启动程序，注意：Windows 用户全局安装 cross-env，使用：

    npm i cross-env -g
    cross-env NODE_ENV=production supervisor index

** pm2**

当我们的博客要部署到线上服务器时，不能单纯的靠 node index 或者 supervisor index 来启动了，因为我们断掉 SSH 连接后服务就终止了，这时我们就需要像 pm2 或者 forever 这样的进程管理工具了。pm2 是 Node.js 下的生产环境进程管理工具，就是我们常说的进程守护工具，可以用来在生产环境中进行自动重启、日志记录、错误预警等等。以 pm2 为例，全局安装 pm2：`npm i pm2 -g`

修改 package.json，添加 start 的命令：

	"scripts": {
	  "test": "istanbul cover _mocha",
	  "start": "cross-env NODE_ENV=production pm2 start index.js --name 'myblog'"
	}
然后运行 npm start 通过 pm2 启动程序。pm2常用命令如下：


    pm2 start/stop: 启动/停止程序
    pm2 reload/restart [id|name]: 重启程序
    pm2 logs [id|name]: 查看日志
    pm2 l/list: 列出程序列表
	pm2 -h帮助

**部署到阿里云**
由于自己用的windows系统，所以N-blog给的教程远程连接服务器的命令无法使用，只得再次求助搜索引擎。。。

1、下载安装xshell

Xshell是一个强大的安全终端模拟软件，它支持SSH1, SSH2, 以及Microsoft Windows 平台的TELNET 协议,终端模拟软件，用于远程连接，但后面发现自己买的服务器是windows server 2008。不需要使用xshell，xshell主要是用来跨终端使用的。

直接使用windows系统自带的远程终端连接就好，填写服务器的公网ip以及用户名和登陆密码即可登录远程服务器。

2、安装node.js环境

参考博客[如何在阿里云远程主机上部署node.js服务器](http://blog.csdn.net/qq_15267341/article/details/52442514)。

花了9.9,最终放弃了部署在云服务器上，毕竟9.9，还不明觉厉的选了windows系统，9.9的windows server 2008,连node.js都装不起，不知道怎么部署了。我还是按N-blog的教程体验下就好了。

3、安装mongodb

4、安装git

5、使用pm2启动。