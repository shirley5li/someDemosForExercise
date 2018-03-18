// 登录功能路由模块的实现
// app.use('/signin', require('./signin'));
const sha1 = require('sha1');
const express = require('express');
const router = express.Router();

const UserModel = require('../models/users');
const checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signin 登录页
router.get('/', checkNotLogin, function(req, res, next) {
    res.render('signin');
});

// POST /signin 用户登录
router.post('/', checkNotLogin, function(req, res, next) {
    const name = req.fields.name;
    const password = req.fields.password;

    // 校验参数
    try {
        if (!name.length) {
            throw new Error('请填写用户名');
        }
        if (!password.length) {
            throw new Error('请填写密码');
        }
    } catch (e) {
        req.flash('error', e.message);
        // back重定向，重定向到请求的referer，当没有referer请求头的情况下，默认为'/'
        return res.redirect('back');
    }
    UserModel.getUserByName(name)   //UserModel相当于一个collection
        .then(function(user) {
            if (!user) {
                req.flash('error', '用户不存在');
                return res.redirect('back');
            }
            // 检查密码是否匹配
            // ??疑问：在routes\signup.js中已将user.password删除，这里又是如何取得的？
            // 自问自答:应该是删除用户的密码这样的隐私数据后将用户信息存入session，并不是将数据库中的user.password删掉
            if (sha1(password) !== user.password) { 
                req.flash('error', '用户名或密码错误');
                return res.redirect('back');
            }
            req.flash('success', '登录成功');
            // 用户信息写入到session
            delete user.password;
            req.session.user = user;
            // 跳转到网站主页
            res.redirect('/posts');
        })
        .catch(next);
});

module.exports = router;