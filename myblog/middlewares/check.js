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