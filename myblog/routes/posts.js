// 文章操作功能路由模块的实现
//  app.use('/posts', require('./posts'));
const express = require('express');
const router = express.Router();

const PostModel = require('../models/posts');   //引入文章相关数据库操作模型
const CommentModel = require('../models/comments'); //引入评论相关数据库操作模型

// 检查用户是否登录，只有用户登录了才能有发表、修改、删除文章的权限，否则只能浏览文章
const checkLogin = require('../middlewares/check').checkLogin;

// GET /posts 所有用户(网站主页)或者特定用户(个人主页)的文章
// 例如 GET /posts?author=xxx
//
router.get('/', function(req, res, next) {
    const author = req.query.author;

    PostModel.getPosts(author)
        .then(function(posts) {
            res.render('posts', {
                posts: posts
            });
        })
        .catch(next);
});

// POST /posts/create 发表一篇文章
router.post('/create', checkLogin, function(req, res, next) {
    const author = req.session.user._id;    //用户登录后已将个人信息存入session
    const title = req.fields.title;
    const content = req.fields.content;

    // 校验参数
    try {
        if (!title.length) {
            throw new Error('请填写标题');
        }
        if (!content.length) {
            throw new Error('请填写内容');
        }
    } catch(e) {
        req.flash('error', e.message);
        return res.redirect('back');
    }

    let post = {
        author: author,
        title: title,
        content: content
    };

    PostModel.create(post)
        .then(function(result) {
            // 此 post 是插入 mongodb 后的值，包含 _id
            post = result.ops[0];
            req.flash('success', '发表成功');
            // 发表成功后跳转到该文章页
            res.redirect(`/posts/${post._id}`);
        })
        .catch(next);
});

// GET /posts/create 发表文章页
router.get('/create', checkLogin, function(req, res, next) {
    res.render('create');
});

// GET /posts/:postId 单独一篇的文章页，即文章详情页
router.get('/:postId', function(req, res, next) {
    const postId = req.params.postId;

    // Promise.all方法用于将多个Promise实例包装成一个新的Promise实例
    Promise.all([
      PostModel.getPostById(postId), //获取文章信息
      CommentModel.getComments(postId), // 获取该文章所有留言
      PostModel.incPv(postId) //pv加1
    ])
      .then(function(result) {
        const post = result[0];
        const comments = result[1];
        if (!post) {
          throw new Error('该文章不存在');
        }

        res.render('post', {
          post: post,
          comments: comments
        });
      })
      .catch(next);
});

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function(req, res, next) {
    const postId = req.params.postId;
    const author = req.session.user._id;

    PostModel.getRawPostById(postId)
      .then(function(post) {
        if (!post) {
          throw new Error('该文章不存在');
        }
        if (author.toString() !== post.author._id.toString()) {
          throw new Error('权限不足');
        }
        res.render('edit', {
          post: post
        });
      })
      .catch(next);
});

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, function(req, res, next) {
    const postId = req.params.postId;
    const author = req.session.user._id;
    const title = req.fields.title;
    const content = req.fields.content;

    // 校验参数
    try {
      if (!title.length) {
        throw new Error('请填写标题');
      }
      if (!content.length) {
        throw new Error('请填写内容');
      }
    } catch (e) {
      req.flash('error', e.message);
      return res.redirect('back');
    }

    PostModel.getRawPostById(postId)
    .then(function (post) {
      if (!post) {
        throw new Error('文章不存在');
      }
      if (post.author._id.toString() !== author.toString()) {
        throw new Error('没有权限');
      }
      PostModel.updatePostById(postId, { title: title, content: content })
        .then(function () {
          req.flash('success', '编辑文章成功');
          // 编辑成功后跳转到上一页
          res.redirect(`/posts/${postId}`);
        })
        .catch(next);
    });
});

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, function(req, res, next) {
  const postId = req.params.postId;
  const author = req.session.user._id;

  PostModel.getRawPostById(postId)
    .then(function (post) {
      if (!post) {
        throw new Error('文章不存在');
      }
      if (post.author._id.toString() !== author.toString()) {
        throw new Error('没有权限');
      }
      PostModel.delPostById(postId)
        .then(function () {
          req.flash('success', '删除文章成功')
          // 删除成功后跳转到主页
          res.redirect('/posts');
        })
        .catch(next);
    });
});
module.exports = router;
