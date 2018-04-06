var util = require("../../utils/util.js");
var app = getApp();

Page({

    data: {
        inTheaters: {},
        comingSoon: {},
        top250: {},
        searchResult: {},
        containerShow: true,
        searchPanelShow: false
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var inTheaterUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start = 0&count=3"; //正在上映
        var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3"; //即将上映
        var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3"; //top 250

        this.getMovieListData(inTheaterUrl, "inTheaters", "正在热映");
        this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
        this.getMovieListData(top250Url, "top250", "豆瓣Top250");
    },


    /**
   * 电影主页搜索框聚焦时，电影内容页面隐藏，电影搜索页面显现，实现页面切换
   */
    onBindFocus: function (event) {
        this.setData({
            containerShow: false,
            searchPanelShow: true
        });
    },


    /**
     * 点击X符号，退出搜索页面，恢复到电影列表主页
     */
    onCancelImgTap: function (event) {
        this.setData({
            containerShow: true,
            searchPanelShow: false,
        });
    },


    /**
     * 在搜索框输入文字，从豆瓣搜索API返回数据
     */
    onBindConfirm: function (event) {
        var text = event.detail.value;
        var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
        this.getMovieListData(searchUrl, "searchResult", "");
    },


    /**
   * 从豆瓣API请求电影列表数据,参数url为请求的豆瓣API路径，category为电影分类 正在上映/即将上映/top250
   */
    getMovieListData: function (url, category, category_CN) {
        var that = this;
        wx.request({
            url: url,
            header: {
                'content-type': 'json'
            },
            method: 'GET',
            success: function (res) {
                that.processDoubanData(res.data, category, category_CN);
            },
            fail: function () {
                console.log("failed");
            }
        });
    },


    /**
   * 处理从豆瓣获取的数据
   */
    processDoubanData: function (moviesDouban, category, category_CN) {

        var movies = []; //用于存放获取的电影列表的相关有用数据

        for (var index in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[index];
            var title = subject.title;
            if (title.length > 6) {
                title = title.substring(0, 6) + "...";
            }

            // 存放需要用到的每个电影的数据到一个临时对象
            var temp = {
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id,
                stars: util.convertToStarsArray(subject.rating.stars)
            };

            // 将临时对象中每个电影的数据push进movies数组
            movies.push(temp);
        }

        // 将不同类别的movies数组存进data对象
        var readyData = {};
        readyData[category] = {
            movies: movies,
            category_CN: category_CN
        };

        this.setData(readyData);
    },


    /**
   * 点击"更多"，获取一个九宫格的更多电影more-movies.wxml页面
   */
    onMoreTap: function (event) {
        var category = event.currentTarget.dataset.category;
        wx.navigateTo({
            url: 'more-movies/more-movies?category=' + category,
        })
    },


    /**
   * 在电影列表页面，点击某个电影，跳转到电影详情页面
   */
    onMovieTap: function (event) {
        // 注意踩坑！！！dataset对象中的属性均为小写{movieid: "27592315"}，即使在wxml中绑定的data-movieId
        var movieId = event.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: 'movie-detail/movie-detail?movieId=' + movieId,
        })
    },

});