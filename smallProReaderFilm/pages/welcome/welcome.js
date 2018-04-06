Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 自定义的事件处理函数
   */
  onTap: function(event) {
      
    //  redirectTo和navigateTo不能再跳转到带有tab选项卡的页面，要使用wx.switchTab，专门用来跳转到带有tabbar的页面
    wx.switchTab({
        url: '../posts/post',
    });
  }
})