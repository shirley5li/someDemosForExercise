# 2018 春季阿里 前端实习 在线测评编程题实现

实现效果：有两个上下排列的盒子，当鼠标滚动的时候，box1以鼠标滚动2倍的速度运动，box2以鼠标滚动3倍的速度运动。

参考自博客[2018年春季阿里前端工程师实习岗在线测评编程题总结 ](http://blog.csdn.net/j_h_s/article/details/63686140?winzoom=1)

[jQuery - 鼠标滚轮插件jquery.mousewheel.js详解（上下、左右滚动监听）](http://www.hangge.com/blog/cache/detail_1863.html)

**思路**
主要是处理兼容的鼠标滚动事件，将box1 box2绝对定位，然后通过鼠标滚动事件获取滚动高度，然后修改两个box的top值。但效果不怎么好，总觉得这不是一个好的实现方法。待以后遇到类似案例再来补充完善。


