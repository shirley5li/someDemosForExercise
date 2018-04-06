// 引入本地数据库数据
var postsData = require("../../../data/posts-data.js")

// 全局的app变量
var app = getApp();

Page({
    data: {
        isPlayingMusic: false,
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        // 通过url的查询参数获取文章id数据
        var postId = options.id;

        // 将postId存入data中转，以备onCollectionTap()事件处理函数使用
        this.data.currentPostId = postId;

        var postData = postsData.postList[postId]; //postsData 为一个包含数组postList的对象,数组postList中包含若干文章对象
        // this.data.postData = postData;
        this.setData({
            postData: postData
        });

        // 从缓存中读取所有用户文章的收藏状态
        var postsCollected = wx.getStorageSync('posts_collected');

        // 获取当前用户的文章收藏状态
        if (postsCollected) {
            var postCollected = postsCollected[postId];
            this.setData({
                collected: postCollected
            });
        } else { //如果缓存中没有postsCollected对象，即所有用户的文章均未被收藏过
            var postsCollected = {};
            postsCollected[postId] = false;

            // 将当前文章的收藏状态写入缓存
            wx.setStorageSync('posts_collected', postsCollected);
        }

        // 通过全局的音乐播放状态变量(并且记录的全局音乐播放状态是当前文章的)，实现当退出详情页再进入时，保持退出之前的音乐图标状态
        if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
            this.setData({
                isPlayingMusic: true
            });
        }
        // 使音乐总控开关与页面音乐控制按钮同步
        this.setMusicMonitor();

    },


    /**
   * 使音乐总控开关与页面音乐控制按钮同步
   */
    setMusicMonitor: function () {
        var that = this;
        wx.onBackgroundAudioPlay(function () {
            that.setData({
                isPlayingMusic: true
            });

            // 如果监听到在播放音乐，则将音乐播放状态存入全局变量，以备退出详情页再次进入时保持音乐图标是退出之前的样子
            app.globalData.g_isPlayingMusic = true;

            // 记录哪一篇文章的音乐在播放
            app.globalData.g_currentMusicPostId = that.data.currentPostId;
        });

        wx.onBackgroundAudioPause(function () {
            that.setData({
                isPlayingMusic: false
            });

            app.globalData.g_isPlayingMusic = false;

            // 如果音乐没有在播放，则清空记录音乐播放所在文章
            app.globalData.g_currentMusicPostId = null;
        });

        // 监听音乐播放完毕时，将音乐图标改变为停止状态，如果不设置wx.onBackgroundAudioStop，即使音乐播放结束了图标还是正在播放状态
        wx.onBackgroundAudioStop(function () {
            that.setData({
                isPlayingMusic: false
            });

            app.globalData.g_isPlayingMusic = false;

            // 如果音乐播放完毕，则清空记录音乐播放所在文章
            app.globalData.g_currentMusicPostId = null;
        });
    },


    /**
   * 用户点击收藏按钮事件
   */
    onCollectionTap: function (event) {
        this.getPostsCollectionSync();
        // this.getPostsCollectionAsyn(); //此处我们只使用同步的方法

    },


    /**
   * 同步方法获取缓存中的文章收藏状态，并更新缓存文章收藏状态，显示收藏成功通知
   */
    getPostsCollectionSync: function () {

        // 获取缓存数据，查看所有文章的收藏状态
        var postsCollected = wx.getStorageSync('posts_collected');

        // 当前文章的收藏状态,借助data对象获取当前文章的postId
        var postCollected = postsCollected[this.data.currentPostId];

        // 将收藏状态取反
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;

        // 显示收藏成功通知
        this.showToast(postsCollected, postCollected);
    },


    /**
   * 异步方法获取缓存中的文章收藏状态，并更新缓存文章收藏状态，显示收藏成功通知
   */
    getPostsCollectionAsyn: function () {
        var that = this;
        wx.getStorage({
            key: 'posts_collected',
            success: function (res) {

                // 获取缓存数据，查看所有文章的收藏状态
                var postsCollected = res.data;

                // 当前文章的收藏状态,借助data对象获取当前文章的postId
                var postCollected = postsCollected[that.data.currentPostId];

                // 将收藏状态取反
                postCollected = !postCollected;
                postsCollected[that.data.currentPostId] = postCollected;

                // 显示收藏成功通知
                that.showToast(postsCollected, postCollected);
            },
        });
    },


    /**
   * 用户点击分享按钮事件
   */
    onShareTap: function (event) {
        var itemList = [
            "分享给微信好友",
            "分享到朋友圈",
            "分享到QQ",
            "分享到微博"
        ];
        wx.showActionSheet({
            itemList: itemList,
            itemColor: "#405f80",
            success: function (res) {
                // res.cancel 用户是不是点击了取消
                // res.tapIndex 数组元素索引，即从0开始

                // 小程序分享到朋友圈的功能暂未开放，等后面使用了小程序ID部署后，再来曲线模拟分享功能
                console.log("用户" + itemList[res.tapIndex]);
            }
        });
    },



    /**
   * 显示消息提示框，包括更新收藏状态的缓存、通知用户收藏成功
   */
    showToast: function (postsCollected, postCollected) {

        // 更新收藏状态的缓存值
        wx.setStorageSync('posts_collected', postsCollected);

        // 更新数据绑定变量data对象的收藏状态值，从而实现切换图片
        this.setData({
            collected: postCollected
        });

        // 通知用户收藏成功
        wx.showToast({
            title: postCollected ? "收藏成功" : "取消成功",
            duration: 1000,
            icon: "success"
        });
    },


    /**
   * 音乐播放功能
   */
    onMusicTap: function (event) {
        var currentPostId = this.data.currentPostId;
        var postDataMusic = postsData.postList[currentPostId].music;

        var isPlayingMusic = this.data.isPlayingMusic; //音乐是否正在播放的状态

        if (isPlayingMusic) {

            // 暂停音乐播放
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayingMusic: false
            });
        } else {

            // 开始播放音乐
            wx.playBackgroundAudio({
                dataUrl: postDataMusic.dataUrl,
                title: postDataMusic.title,
                coverImgUrl: postDataMusic.coverImgUrl
            });
            this.setData({
                isPlayingMusic: true
            });
        }
    }
});