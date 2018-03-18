// 注册功能路由模块的实现
// app.use('/signup', require('./signup'));
const fs = require('fs');   //处理文件
const path = require('path');   //处理路径
const sha1 = require('sha1');   //用户数据哈希加密
const express = require('express');
const router = express.Router();

const UserModel = require('../models/users');   //用户数据模型
const checkNotLogin = require('../middlewares/check').checkNotLogin;    //检查用户状态-是否登录

// GET /signup 注册页
router.get('/', checkNotLogin, function(req, res, next) {
    res.render('signup');
});

// POST /signup 用户注册
router.post('/', checkNotLogin, function(req, res, next) {
    const name = req.fields.name;
    const gender = req.fields.gender;
    const bio = req.fields.bio;
    // windows 系统下,'foo\\bar\\shirley.png'.split(path.sep)返回 ['foo', 'bar', 'shirley.png']，
    // arrayObject.pop()方法将删除 arrayObject 的最后一个元素，把数组长度减 1，并且返回它删除的元素的值，
    // 所以以下语句相当于 avatar = 头像图片的文件名，例如avatar = 'shirley.png'
    const avatar = req.files.avatar.path.split(path.sep).pop();
    let password = req.fields.password;
    const repassword = req.fields.repassword;

    // 校验参数
    try {
        if (!(name.length >=1 && name.length <= 10)) {
            throw new Error ('名字请限制在1-10个字符之间');
        }
        if (['m', 'f', 'x'].indexOf(gender) === -1) {
            throw new Error ('性别只能是 m、f 或 x');
        }
        if (!(bio.length >= 1 && bio.length <= 30)) {
            throw new Error ('个人简介请限制在1-30个字符之间');
        }
        if (!req.files.avatar.name) {
            throw new Error ('缺少头像');
        }
        if (password.length < 6) {
            throw new Error ('密码至少六个字符');
        }
        if (password !== repassword) {
            throw new Error ('两次输入的密码不一致');
        }
    } catch (e) {
        // 注册失败，异步删除上传的头像
        fs.unlink(req.files.avatar.path);
        req.flash('error', e.message);
        return res.redirect('/signup');
    }

    // 明文密码加密后再存入数据库，存入数据库中的密码其实是自己设置的密码经过hash之后的字符串，
    // 感觉这个hash过程应该在客户端表单点提交的时候完成，不然http传输的都是明文密码，
    // 这个例子本来在客户端的一些事情都在服务器端完成的，需要很大的改进。这是现在似懂非懂的我混乱的认识，不知对不对。
    password = sha1(password);

    // 待写入数据库的用户信息
    let user = {
        name: name,
        password: password,
        gender: gender,
        bio: bio,
        avatar: avatar
    };

    // 用户信息写入数据库
    UserModel.create(user)    //UserModel.create(user) 相当于在collection中创建一个文档,该文档中保存了该用户的信息
        .then(function(result) {
            // 此 user 是插入 mongodb 后的值，包含 _id
            user = result.ops[0];
            //  删除密码这种敏感信息，将用户信息存入 session
            delete user.password;
            // 将用户信息保存入 session，以便使用中间件middlewares\check.js检查用户是否登录的状态
            req.session.user = user;
            // 写入flash
            req.flash('success', '注册成功');
            // 跳转到首页
            res.redirect('/posts');
        })
        .catch(function(e) {
            // 注册失败，异步删除上传的头像
            fs.unlink(req.files.avatar.path);
            // 用户名被占用则跳回注册页，而不是错误页
            if (e.message.match('duplicate key')) {
                req.flash('error', '用户名已被占用');
                return res.redirect('/signup');
            }
            next(e);
        });
});

module.exports = router;