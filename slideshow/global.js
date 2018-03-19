// 获取展示轮播图的包裹元素
var box = document.getElementById("box");
var ul = document.getElementById("ul"); //包裹图片的元素
// 获取ul的子元素节点，即所有的包含图片的li元素
var ulLis = ul.children;
var imgCounts = ulLis.length; //图片总张数

// 滚动次数
var count = 0;
// 滚动方向
var isRight = true;
// 定时器对象
var timer;

// 根据图片张数动态生成下方的小圆圈
// 用js生成包含数字的小圆圈
function showCircle() {
    // 获取每个li元素的宽度
    var liWidth = ulLis[0].offsetWidth;
    // 创建ol li元素
    var ol = document.createElement('ol');
    ol.setAttribute('id', 'ol');
    for (var i = 0; i < imgCounts; i++) {
        var li = document.createElement('li');
        li.innerHTML = i + 1;
        ol.appendChild(li);
    }
    box.appendChild(ol);
}

/******************* 动画部分 **************/

// 正向反向轮播，参数interval表示轮播时间间隔，color表示当前显示图片对应的圆圈颜色，olLis表示ol元素下的li元素
function showTime(interval, color, olLis) {
    timer = setInterval(function () {
        if (isRight == true) { //正向轮播
            count++;
            ul.style.transform = 'translate(' + (-500 * count) + 'px)'; //会控制图片集体向左推500px的距离，让第二张图片进入到显示容器中
            if (count >= imgCounts - 1) { //向右滚动到最后一张图片时，向右滚动(图片张数-1)次，即可滚动到最右一张
                count = imgCounts - 1;
                isRight = false; //向右滚动到最右边一张后开始向左反向滚动
            }
        } else { //反向轮播
            count--;
            ul.style.transform = 'translate(' + (-500 * count) + 'px)';
            if (count <= 0) {
                count = 0;
                isRight = true; //向左滚动到最左一张后开始向右正向滚动
            }
        }
        // 用于使当前播放的图片对应圆圈高亮
        for (var a = 0; a < olLis.length; a++) {
            olLis[a].style.backgroundColor = "#FFF0F5";
        }
        olLis[count].style.backgroundColor = color;
    }, interval);
}

// 两个方向键控制轮播方向的动画效果，参数用于传入轮播函数showTime
function arrowControl(interval, color, olLis) {
    // 获取两个控制方向的箭头元素
    var arrows = document.getElementsByClassName('arrows')[0].children;
    for (var i = 0; i < arrows.length; i++) {
        // 鼠标悬停时停止计时器
        arrows[i].onmouseover = function () {
            clearInterval(timer);
        };
        // 鼠标离开时添加定时器
        arrows[i].onmouseout = function () {
            showTime(interval, color, olLis);
        };
        // 为箭头增加鼠标点击事件
        arrows[i].onclick = function () {
            if (this.title == '下一张') {
                count++;
                if (count > imgCounts - 1) {
                    count = 0;
                }
            } else {
                count--;
                if (count < 0) {
                    count = imgCounts - 1;
                }
            }
            ul.style.transform = 'translate(' + (-500) * count + 'px)';
            for (var a = 0; a < olLis.length; a++) {
                olLis[a].style.backgroundColor = "#FFF0F5";
            }
            olLis[count].style.backgroundColor = color;
        };
    }
}

// 鼠标悬停在底部圆圈的动画效果
function circleControl(interval, color, olLis) {

    // 鼠标悬停在底部按钮的操作
    for (var i = 0; i < olLis.length; i++) {
        olLis[i].index = i;

        // 鼠标经过时，停止轮播，并且当前圆圈颜色加深
        olLis[i].onmouseover = function () {
            // 清除定时器
            clearInterval(timer);

            // 鼠标当前悬停圆圈颜色高亮
            for (var a = 0; a < olLis.length; a++) {
                olLis[a].style.backgroundColor = "#FFF0F5";
            }
            olLis[this.index].style.backgroundColor = color;

            // 悬停到边界图片时，控制方向
            if (this.index == imgCounts - 1) {
                isRight = false;
            }
            if (this.index == 0) {
                isRight = true;
            }
            count = this.index;
            ul.style.transform = 'translate(' + (-500) * count + 'px)';

            
        };

        // 鼠标离开时，继续轮播
        olLis[i].onmouseout = function () {
            showTime(interval, color, olLis);
        };
    }
}



window.onload = function () {
    // 文档加载完毕后确定圆圈个数
    showCircle();

    // 获取底部的圆圈元素
    var ol = document.getElementById('ol');
    var olLis = ol.getElementsByTagName('li');

    olLis[0].style.backgroundColor = 'orange';

    // 图片开始轮播
    showTime(2000, 'orange', olLis);               

    // 箭头控制轮播方向
    arrowControl(2000, 'orange', olLis);

    // 鼠标悬停圆圈效果
    circleControl(2000, 'orange', olLis);

};