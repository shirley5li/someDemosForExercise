// 根据星级数，将星级转化为包含 1 0的数组
function convertToStarsArray(stars) {
    var num = stars.toString().substring(0,1);
    var arr = [];

    for (var i = 0; i < num; i++) {
        if (i <= num) {
            arr.push(1);
        } else {
            arr.push(0);
        }
    }
    return arr;
}


/**
* 异步请求http数据
*/
function http(url, callback) {
    wx.request({
        url: url,
        header: {
            'content-type': 'json'
        },
        method: 'GET',
        success: function (res) {
            callback(res.data);
        },
        fail: function () {
            console.log("failed");
        }
    });
}


/**
* 根据id返回的电影数据中，演员名字的处理，将演员名转化为字符串
*/
function convertToCastString(casts) {
    var castsjoin = "";
    for (var index in casts) {
        castsjoin = castsjoin + casts[index].name + "/ ";
    }
    return castsjoin.substring(0, castsjoin.length - 2);
}


/**
* 根据id返回的电影数据中，演员信息的处理，包括头像、名字信息，返回由各位演员信息构成的数组
*/
function convertToCastInfos(casts) {
    var castsArray = [];
    for (var index in casts) {
        var cast = {
            img: casts[index].avatars ? casts[index].avatars.large : "",
            name: casts[index].name
        };
        castsArray.push(cast);
    }
    return castsArray;
}

module.exports = {
    convertToStarsArray: convertToStarsArray,
    http: http,
    convertToCastString: convertToCastString,
    convertToCastInfos: convertToCastInfos
};