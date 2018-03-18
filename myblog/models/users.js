// 存放用户信息数据相关的数据库操作

const User = require('../lib/mongo').User;  //Mongolass生成的用户信息模型，相当于一个collection

module.exports = {
    // 注册一个用户
    create: function create(user) {
        return User.create(user).exec();
    },

    // 通过用户名获取用户信息
    getUserByName: function getUserByName(name) {
        // Mongolass has some built-in plugins, only for find and findOne。 下面的addCreateAt()就是一个自定义的插件
        return User.findOne({name: name})
        // 使用了 addCreatedAt 自定义插件（通过 _id 生成时间戳）
        .addCreatedAt()
        .exec();
    }
};
