// pages/movies/more-movies/more-movies.js

var util = require("../../../utils/util.js");
var app = getApp();

Page({

    data: {
        movies: {},
        requestUrl: "",
        totalCount: 0,
        isEmpty: true
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // category是通过跳转路径携带的参数，表示当前点击的"更多"属于哪个电影分类
        var category = options.category;

        // 动态设置当前页面导航栏的标题
        wx.setNavigationBarTitle({
            title: category,
        });

        // 根据不同的category设置不同分类电影的请求url
        var dataUrl = "";
        switch (category) {
            case "正在热映":
                dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
                break;

            case "即将上映":
                dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
                break;

            case "豆瓣Top250":
                dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
                break;
        }

        // 用于 onScrollLower中，处理每次上滑更新的requestUrl
        this.setData({
            requestUrl: dataUrl
        });
        util.http(dataUrl, this.processDoubanData);


    },


    /**
   * 处理从豆瓣获取的数据
   */
    processDoubanData: function (moviesDouban) {
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

        // 如果是第一次加载即加载20条，如果是下拉刷新需要再加上之前加载的20条，一共需要绑定40条数据，依此类推。isEmpty用于判断是否第一次加载电影数据
        var totalMovies = {};
        if (!this.data.isEmpty) {
            totalMovies = this.data.movies.concat(movies);
        } else {
            totalMovies = movies;
            this.data.isEmpty = false;
        }

        // 将不同类别的movies数组存进data对象,movies为一个包含20条电影数据的数组，数组每个元素都为一个电影，包含若干属性
        this.setData({
            movies: totalMovies,
        });

        // 用于onScrollLower事件处理函数中，确定已经加载了多少条电影数据，下拉更新时的url请求的start字段，即再加载下一批20条电影数据
        this.data.totalCount += 20;

        // 电影数据处理完毕存入data对象后，停止loding和下拉刷新
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
    },


    /**
     * 监听sroll-view组件的scrolltolower 事件，实现上滑加载更多数据，紧接着之前已经加载出的数据
     */
    // onScrollLower: function(event) {
    //     var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";

    //     util.http(nextUrl, this.processDoubanData);
    //     wx.showNavigationBarLoading();
    // },


    /**
     * 监听页面的onReachBottom事件，实现上滑加载更多数据，紧接着之前已经加载出的数据
     */
    onReachBottom: function (event) {
        var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";

        util.http(nextUrl, this.processDoubanData);
        wx.showNavigationBarLoading();
    },


    /**
     * 监听下拉刷新事件，相当于从头开始加载数据
     */
    onPullDownRefresh: function (event) {
        var refreshUrl = this.data.requestUrl + "?start=0" + "&count=20";
        this.data.movies = {};
        this.data.isEmpty = true;
        this.data.totalCount = 0;

        util.http(refreshUrl, this.processDoubanData);
        wx.showNavigationBarLoading();
    },


    /**
     * 在更多电影页面，点击某个电影，跳转到电影详情页面
     */
    onMovieTap: function (event) {
        // 注意踩坑！！！dataset对象中的属性均为小写{movieid: "27592315"}，即使在wxml中绑定的data-movieId
        var movieId = event.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: '../movie-detail/movie-detail?movieId=' + movieId,
        })
    },


});