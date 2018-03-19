参考自博客[js实现轮播图原理及示例](http://blog.csdn.net/diligentkong/article/details/55209861)。

[十五分钟用JavaScript基础写一个图片轮播效果 + 思路详解](https://www.jianshu.com/p/b7150b071684)。


图片轮播的原理: 就是图片排成一行（ul下包含了一行很多个li元素，ul的宽度为横向排列的额所有图片长度之和），然后准备一个只有一张图片大小的容器(比如代码中的box盒子)，对这个容器设置超出部分隐藏，再控制定时器来让这些图片整体左移或右移(绝对定位)，根据滚动次数来确定将ul移动多远的距离，设置定时器一次移动一张，这样呈现出来的效果就是图片在轮播了。

![div+css样式](http://img.blog.csdn.net/20170215144635821?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZGlsaWdlbnRrb25n/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)。


![未使用js轮播之前的静态效果](http://ou3oh86t1.bkt.clouddn.com/demo/slideshow/images/1.png)

小圆圈 1 2 3 并不是写死的，它是根据ul li中的图片张数来决定。利用js获取到ul的所有子元素li，然后根据li元素的个数，创建相对应的ol元素下的li元素个数，然后将ol元素追加到box下。

实现步骤

（1）根据图片的张数动态生成下方的圆圈数，可以在html结构中方便的添加多张图片（但动态生成dom元素应该比较影响性能）

（2）图片自动轮播，需要一个定时器，轮播至最后一张图片的时候，反向向左轮播，循环反复(注意判断轮播方向)，并且当前播放的图片对应圆圈高亮。

通过`ul.style.transform = 'translate(' + (-500 * count) + 'px)';`根据移动次数`count`设置ul中图片的移动距离。

（3）设置方向键的动画效果，鼠标移到方向箭头上时图片停止自动播放(这需要清除定时器)，移开时图片恢复自动播放，当点击方向箭头时，向前或向后翻页，同样当前播放的图片对应圆圈高亮。

（4）设置下方圆圈的动画效果，当鼠标悬停在上方时停止轮播(清除定时器)，同时对应圆圈高亮，鼠标离开时继续轮播，注意悬停在边界图片即最左边和最右边图片时的轮播方向控制。

【待完善之处...】

后面需要再学习下使用框架实现轮播图效果，感觉现在这个频繁操作dom，应该很影响性能。

[demo on CodePen](https://codepen.io/shirley5li/full/qoqgVj/)

