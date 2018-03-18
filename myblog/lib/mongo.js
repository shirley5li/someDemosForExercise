// 主要用于连接数据库，对mongodb进行增删改查。使用了mongolass模块
const config = require('config-lite')(__dirname);
const Mongolass = require('mongolass');
const mongolass = new Mongolass();
mongolass.connect(config.mongodb);

const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');

// 根据 _id 生成创建时间 created_at。 _id即为存储用户信息数据文档的唯一标识符
// 每个文档都有唯一的"_id" 值，来确保集合里面每个文档都能被唯一标识
mongolass.plugin('addCreatedAt', {   // mongolass.plugin(pluginName, hooks);// register global plugin
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


// 用户的schema模型，定义用户表的schema模型，并生成导出User这个model。 User就相当于一个collection
exports.User = mongolass.model('User', {
    name: {type: 'string', required: true},
    password: {type: 'string', required: true},
    avatar: {type: 'string', required: true},
    gender: {type: 'string', enum: ['m', 'f', 'x'], default: 'x'},
    bio: {type: 'string', required: true}
});
exports.User.index({name: 1}, {unique: true}).exec();//建立了按name正序排列的索引，并且不能重复,即根据用户名找到用户，用户名唯一。


// 文章的schema模型， Post就相当于一个collection
exports.Post = mongolass.model('Post', {
    author: {type: Mongolass.Types.ObjectId, required: true},
    title: {type: 'string', required: true},
    content: {type: 'string', required: true},
    pv: {type: 'number', default: 0}
});
exports.Post.index({author: 1, _id: -1}).exec();    //按创建时间降序查看用户的文章列表(最新创建的文章在最上方)， _id中包含有文档的创建时间


// 留言的schema模型， Comment就相当于一个collection
// 只需要留言的作者 id、留言内容和关联的文章 id 这几个字段
exports.Comment = mongolass.model('Comment', {
  author: { type: Mongolass.Types.ObjectId, required: true },
  content: { type: 'string', required: true },
  postId: { type: Mongolass.Types.ObjectId, required: true }
})
exports.Comment.index({ postId: 1, _id: 1 }).exec();   // 通过文章 id 获取该文章下所有留言，按留言创建时间升序(最新创建的留言在最下方)




