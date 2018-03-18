// 主要是根据文章的数据信息，对数据库执行一些操作

const marked = require('marked');   //引入该模块以解析markdown语法，数据库中的文章内容是以markdown语法存放的，需要取出来转化为html形式再为模板所用
const Post = require('../lib/mongo').Post;  //Post就相当于一个模型化了的collection，是一个Model
const User = require('../lib/mongo').User;

const CommentModel = require('./comments'); //引入评论集合的数据库操作模型

// 给 post 添加留言数 commentsCount
// 在 PostModel 上注册了 addCommentsCount 用来给每篇文章添加留言数 commentsCount
Post.plugin('addCommentsCount', {
  afterFind: function (posts) {
    return Promise.all(posts.map(function (post) {
      return CommentModel.getCommentsCount(post._id).then(function (commentsCount) {
        post.commentsCount = commentsCount;
        return post;
      });
    }));
  },
  afterFindOne: function (post) {
    if (post) {
      return CommentModel.getCommentsCount(post._id).then(function (count) {
        post.commentsCount = count;
        return post;
      });
    }
    return post;
  }
});



// 将post的content从markdown转为html
// 在 PostModel 上注册了 contentToHtml, contentToHtml 只针对 PostModel 有效,
// addCreatedAt 是在 lib/mongo.js 中 mongolass 上注册的, 因此addCreatedAt 对所有 Model 都有效。
Post.plugin('contentToHtml', {
    afterFind: function(posts) {
        return posts.map(function(post) {
            post.content = marked(post.content);
            return post;
        });
    },
    afterFindOne: function(post) {
        if (post) {
            post.content = marked(post.content);
        }
        return post;
    }
});


module.exports = {
    // 创建一篇文章
    create: function create(post) {
        return Post.create(post).exec();    //根据collection模型返回一个实例化了的collection
    },

    // 通过文章id获取一篇文章
    getPostById: function getPostById(postId) {
        return Post
            .findOne({_id: postId})
            .populate({path: 'author', model: 'User'}) // 使用User模型填充Post中的author字段
            .addCreatedAt()
            .addCommentsCount() //获取文章的浏览量
            .contentToHtml()  //将原生的文章内容(.md)转化为html
            .exec();
    },

    // 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
    getPosts: function getPosts(author) {
        const query = {};
        if (author) {
            query.author = author;
        }
        return Post
            .find(query)
            .populate({path: 'author', model: 'User'})
            .sort({_id: -1})
            .addCreatedAt()
            .addCommentsCount()
            .contentToHtml()
            .exec();
    },

    // 通过文章id给pv加1，即文章的浏览量
    incPv: function incPv(postId) {
        return Post
            .update({_id: postId}, {$inc: {pv: 1}}) // $inc原子操作：增加一个字段（键）的值，如果该键不存在则创建该键(Mongodb 修改器)
            .exec();
    },

    // 通过文章id获取一篇原生文章，用来编辑文章，而不是用 getPostById 返回将 markdown 转换成 html 后的内容。
    getRawPostById: function getRawPostById(postId) {
      return Post
        .findOne({_id: postId})
        .populate({path: 'author', model: 'User'})
        .exec();
    },

    // 通过文章id更新一篇文章
    updatePostById: function updatePostById(postId, data) {
      return Post
        .update({_id: postId}, {$set: data})
        .exec();
    },

    // 通过文章id删除一篇文章
    // 删除集合下 status 等于 D 的一个文档：db.inventory.deleteOne( { status: "D" } )，此处Post即为一个保存所有用户文章的集合
    // delPostById: function delPostById(postId) {
    //   return Post
    //     .deleteOne({_id: postId})
    //     .exec();
    // }


    // 通过用户 id 和文章 id 删除一篇文章
    delPostById: function delPostById (postId, author) {
      return Post
      .deleteOne({ author: author, _id: postId })
      .exec()
      .then(function (res) {
      // 文章删除后，再删除该文章下的所有留言
      if (res.result.ok && res.result.n > 0) {
        return CommentModel.delCommentsByPostId(postId);
      }
    });
}

};
