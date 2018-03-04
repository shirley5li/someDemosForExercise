# 原生Javascript实现瀑布流布局

 常见的网页布局模式有静态,自适应,瀑布流,响应式等模式，参考博客[CSS 常见布局方式 ](http://www.sohu.com/a/168143624_274163)。
 
### 瀑布流 ###
瀑布流，又称瀑布流式布局。是比较流行的一种网站页面布局，视觉表现为参差不齐的多栏布局，随着页面滚动条向下滚动，这种布局还会不断加载数据块并附加至当前尾部。

 1、首先瀑布流所有的图片应该保持宽度一致，高度是由内容决定。

 2、通过定位的方式是我们实现瀑布流的最基本的原理，只要我们动态的设置它的top值、left值，就能让它排列。

 3、定位后确定浏览器显示区域内，一行能放多少列图片盒子。
 
        获取页面的宽度
        获取图片盒子的宽度
        显示的列数 = 页面宽度/图片盒子宽度
        column = pageWidth / itemWidth
4、 确定列数之后，排列第一行

5、第1行排列好之后，获取第1行所有图片盒子的高度
获取图片高度的时候要注意，程序必须写在入口函数onload里面，因为图片的加载特性是：等页面都加载完之后才去请求加载，所以不写在入口函数里可能会出现高度获取不到的情况。

6、排列第2行
获取到刚刚数组中，高度最小的那一列，将第2行的第1个图片盒子放置在它的下方

7、改变最小列当前高度

8、触发resize事件
将整个设置样式的部分封装成一个函数，在onload里面注册一个resize事件，只要页面一发生改变，就触发样式部分的代码。

9、懒加载效果
目前我们用的是30张图片，假如一个页面中有几百张图片的时候，我们不可能等到它都加载完再显示，所有这里引入一个懒加载的概念，我们规定第30张为显示的最后一张图片，当滚动条滚动到30张的时候，应该加载下一批图片。
即页面可视区高度+滚动条卷去的高度 = 第30图片的offsetTop的时候加载下面的图片。

html部分：

    <div id="box">
        <div class="item">
            <img src="../image/瀑布流/001.jpg" alt="">
        </div>                                                      
        <div class="item">
            <img src="../image/瀑布流/030.jpg" alt="">
        </div>
    </div>
具体的瀑布流布局原理参考博客[原生js实现瀑布流效果](https://segmentfault.com/a/1190000012621936)。

**注意点**

1、获取客户端宽度的兼容性处理,以自适应客户浏览器窗口宽度显示不同列图片。

        // clientWidth 处理兼容性
        function getClient() {
            return {
                width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
                height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            }
        }

`window.innerwidth` 返回窗口的文档显示区的宽度(不包含工具条与滚动条)。`document.documentElement.clientWidth || document.body.clientWidth`是为了兼容IE。

2、懒加载效果处理。

3、scrollTop兼容性处理，即计算滚动条卷去的高度

    // scrollTop兼容性处理
    function getScrollTop() {
        return window.pageYOffset || document.documentElement.scrollTop;
    }

**[demo on codePen](https://codepen.io/shirley5li/full/NymmgZ/)**


