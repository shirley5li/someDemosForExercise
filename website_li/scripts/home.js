
$(document).ready(function () {

    // 浏览器标签页被隐藏或显示的时候会触发visibilitychange事件,通过document.hidden判断
    document.addEventListener('visibilitychange', function () {
        var isHidden = document.hidden;
        if (isHidden) {
            clearInterval(timer);
        } else {
            setBanner(i);
            clearInterval(timer);
            setBannerInterval(i);
        }
    });
});

$('.banner_ctr ul.ctr li').click(function () {
    i = $(this).attr('class').charAt(3);
    setBanner(i);
    clearInterval(timer);
    setBannerInterval(i);
});

$('.banner_ctr ul.ctr li:first-child').trigger("click");


var timer = null;
var i = 1; //记录播放到第i张图片
if ($('.ctrBack').position()) {
    var ctrL = $('.ctrBack').position().left; //控制按钮最开始的位置，即在最左边时的位置
}
var ctrW = $('.ctrBack').width(); //控制按钮的宽度

// 设置轮播图定时器
function setBannerInterval(i) {
    timer = setInterval(function () {
        i++;
        if (i > 5) {
            i = 1;
        }
        setBanner(i);
    }, 5000);
}

// 轮播图设置
function setBanner(i) {
    var curCtrL = ctrL + (ctrW + 4) * (i - 1); //当前控制按钮的位置
    $('.ctrBack').stop().animate({
        left: curCtrL
    }, 300); //立即停止当前正在进行的动画，如果接下来还有动画等待继续进行，则以当前状态开始接下来的动画
    $('.ctrFront').stop().animate({
        left: curCtrL
    }, 300);

    $('.item').css('display', 'none');
    // $('.item .ad_txt p').css('display', 'none');
    $('.item .ad_img').css('left', '100px');
    $('.item' + i).css('display', 'flex').fadeIn();
    $('.item' + i + ' .ad_img').animate({
        'left': '0'
    }, 500);
    $('.item' + i + ' .ad_txt').fadeIn();

    // jquery.mkinfinite插件实现全屏动态背景无限循环缩放动画特效
    $('.item' + i).mkinfinite({
        maxZoom: 1.2,
        animationTime: 4500,
        imagesRatio: (960 / 720),
        isFixedBG: true,
        zoomIn: true,
        imagesList: new Array('images/welcome_bg' + i + '.jpg', 'images/welcome_bg' + i + '.jpg')
    });
}