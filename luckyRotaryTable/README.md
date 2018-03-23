### 思路 ###

(1)通过设置CSS样式的position属性，z-index属性等实现背景图，转盘图与指针图的层叠摆放；

(2)通过js控制元素css属性 style.transform = "rotate(0deg)"实现旋转效果。

css主要为了实现奖品转盘的旋转的过渡效果，为了让指针和奖品转盘以及背景图片层叠使用了position定位和z-index属性。js代码主要是获取dom元素和绑定鼠标点击事件，即点击指针会让奖品转盘旋转。

然后判断转盘是否处于停止状态，如果处于停止状态就可以调用旋转函数rotating()，如果转盘处于旋转状态，即使点击了指针也不能调用旋转函数rotating()。

rotating()函数执行奖品转盘的旋转并判断你指针停在什么位置，然后显示相应的中奖信息。rotating()函数实现转盘的旋转，是通过js控制css的属性`transform: rotate(deg)`中的随机旋转角度，从而让奖品转盘旋转一个随机的角度。4000毫秒后执行的定时器是为了让旋转这个会执行4秒过程执行完后显示相应的中奖信息。


### 遇到的问题 ###
1.在引入外部样式表时，`<link rel="stylesheet" type="text/css" href="style.css">`一定要记得写href属性，不然无法引入外部样式。

[demo on CodePen](https://codepen.io/shirley5li/full/oqwpRO/)