var app = getApp();
var util = require("../../../utils/util.js");

Page({
    data: {
        movie: {}
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var movieId = options.movieId;
        var url = app.globalData.doubanBase + "/v2/movie/subject/" + movieId;
        util.http(url, this.processDoubanData);

    },


    /**
   * 处理从豆瓣获取的数据,主要做必要的判空处理，保证逻辑走通
   */
    processDoubanData: function (data) {
 
        // 导演信息的判空处理
        var director = {
            avatar: "",
            name: "",
            id: ""
        };
        if (data.directors[0] !== null) {
            if (data.directors[0].avatars !== null) {
                director.avatar = data.directors[0].avatars.large;
            }
            director.name = data.directors[0].name;
            director.id = data.directors[0].id;
        }

        var movie = {
            movieImg: data.images ? data.images.large : "",
            country: data.countries[0],
            title: data.title,
            originalTitle: data.original_title,
            wishCount: data.wish_count,
            commentCount: data.comments_count,
            year: data.year,
            genres: data.genres.join("、"),
            stars: util.convertToStarsArray(data.rating.stars),
            score: data.rating.average,
            director: director,
            casts: util.convertToCastString(data.casts),
            castsInfo: util.convertToCastInfos(data.casts),
            summary: data.summary
        };

        this.setData({
            movie: movie
        });

    },



    /**
   * 预览图片
   */
    viewMoviePostImg: function(event) {
        var src = event.currentTarget.dataset.src;
        wx.previewImage({
            current: src,
            urls: [src],
        });
    },



});