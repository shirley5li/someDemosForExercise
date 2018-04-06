// 引入本地数据库中的数据
var postsData = require('../../data/posts-data.js');

Page({
  data: {
   
  },

  onLoad: function (options) {
      
    //模拟服务器传数据过来
    this.setData({
        posts_key: postsData.postList
    });
  },


  /**
   * 点击文章列表跳转到对应的文章详情页
   */
  onPostTap: function(event) {
      var postId = event.currentTarget.dataset.postid;
      wx.navigateTo({
          url: 'post-detail/post-detail?id=' + postId,
      });
    },


    /**
     * 点击轮播图跳转到对应的文章详情页
     */
    onSwiperTap: function(event) {
        var postId = event.target.dataset.postid;
        wx.navigateTo({
            url: 'post-detail/post-detail?id=' + postId,
        });
    },


})