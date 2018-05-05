# 绘制核辐射图标 #
该题目来自360奇舞学院2018前端星计划技术测评，要求垂直、水平居中显示一个半径100的核辐射图标，效果如下：

![效果图](https://user-gold-cdn.xitu.io/2018/4/24/162f6bcc60f9f4f3?w=422&h=320&f=png&s=21160)

## 利用transform绘制 ##

下面先说一下自己回答的关于画这个图标的思路，底部一个黄色纯色圆形`#warning`，里面三个黑色的矩形利用`transform`属性的 rotate、skew方法变换得到三个黑色平行四边形，再使用圆形`#warning`裁剪成扇形。代码如下：

``` html

	<!DOCTYPE html>
	<html lang="en">
	<head>
	    <meta charset="UTF-8">
	    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	    <meta http-equiv="X-UA-Compatible" content="ie=edge">
	    <title>使用transform绘制核辐射图标</title>
	</head>
	<style type="text/css">
	    html {
	        height: 100%;
	    }
	    body {
	        height: 100%;
	        display: flex;
	        justify-content: center;
	        align-items: center;
	    }
	    #warning {
	        position: relative;
	        overflow: hidden;
	        width: 200px;
	        height: 200px;
	        border-radius: 50%;
	        background-color: yellow;
	    }
	
	    #warning ul li {
	        list-style: none;
	        position: absolute;
	        width: 200px;
	        height: 100px;
	        right: 50%;
	        top: 0;
	        -webkit-transform-origin: 100% 100%;
	        -moz-transform-origin: 100% 100%;
	        -ms-transform-origin: 100% 100%;
	        transform-origin: 100% 100%;
	        /*transform-origin设置旋转元素的基点位置*/
	    }
	
	    #warning .sector1 {
	        background-color: black;
	        -webkit-transform: skew(30deg, 0);
	        -moz-transform: skew(30deg, 0);
	        -ms-transform: skew(30deg, 0);
	        transform: skew(30deg, 0);
	    }
	
	    #warning .sector2 {
	        background-color: black;
	        -webkit-transform: rotate(120deg) skew(30deg, 0);
	        -moz-transform: rotate(120deg) skew(30deg, 0);
	        -ms-transform: rotate(120deg) skew(30deg, 0);
	        transform: rotate(120deg) skew(30deg, 0);
	    }
	
	    #warning .sector3 {
	        background-color: black;
	        -webkit-transform: rotate(240deg) skew(30deg, 0);
	        -moz-transform: rotate(240deg) skew(30deg, 0);
	        -ms-transform: rotate(240deg) skew(30deg, 0);
	        transform: rotate(240deg) skew(30deg, 0);
	    }
	</style>
	<body>
	    <div id="warning">
	        <ul>
	            <li class="sector1"></li>
	            <li class="sector2"></li>
	            <li class="sector3"></li>
	        </ul>
	    </div>
	</body>
	</html>
```
## 利用border绘制 ##
该绘制方法是nice的奇舞学院老师给出的，代码如下：

``` html

	<!DOCTYPE html>
	<html lang="en">
	<head>
	    <meta charset="UTF-8">
	    <title>Document</title>
	    <style type="text/css">
	        #warning {
	            width: 200px;
	            height: 200px;
	            border-radius: 50%;
	            /* 水平、垂直居中 */
	            transform: translate(-50%, -50%);
	            position: absolute;
	            left: 50%;
	            top: 50%;
	
	            overflow: hidden;
	        }
	
	        #warning .bg {
	            position: absolute;
	            width: 0;
	            height: 0;
	            top: -73.2px;
	            left: 0px;
	            border-top: solid 173.2px yellow;
	            border-left: solid 100px transparent;
	            border-bottom: solid 173.2px black;
	            border-right: solid 100px transparent;
	        }
	
	        #warning .bg:nth-child(1){
	            transform: rotate(0deg);
	        }
	
	        #warning .bg:nth-child(2) {
	            transform: rotate(120deg);
	        }
	
	        #warning .bg:nth-child(3) {
	            transform: rotate(240deg);
	        }
	    </style>
	</head>
	<body>
	    <div id="warning">
	        <div class="bg"></div>
	        <div class="bg"></div>
	        <div class="bg"></div>
	    </div>
	</body>
	</html>
```
其中：

``` css

	border-top: solid 173.2px yellow;
	border-left: solid 100px transparent;
	border-bottom: solid 173.2px black;
	border-right: solid 100px transparent;
```
实现的效果是利用border构造两个顶角是60度的三角形，如下图所示：

![两个顶角是60度的三角形](https://user-gold-cdn.xitu.io/2018/4/24/162f6bcc5cd67d4f?imageView2/0/w/1280/h/960/ignore-error/1)

然后再利用父元素的overflow-hidden和border-radius剪裁成圆。

## 利用background linear-gradient绘制 ##

这种方法感觉最厉害了，万万没想到，连个background都这么666。再次感谢uni-zheng给与的思路，以及在我对linear-gradient参数设置晕晕乎乎时给与的解答。

张鑫旭的博客[深入理解CSS3 gradient斜向线性渐变](http://www.zhangxinxu.com/wordpress/2013/09/%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3css3-gradient%E6%96%9C%E5%90%91%E7%BA%BF%E6%80%A7%E6%B8%90%E5%8F%98/)。

**线性渐变的参数:** `linear-gradient(  [ <angle> | <side-or-corner> ,]? <color-stop> [, <color-stop>]+ )`，其中`side-or-corner`可选值为：`[left | right] || [top | bottom]`， `color-stop` 为 `<color> [ <percentage> | <length> ]`

**注意：**  (1)`linear-gradient`作为`background`的`background-image`属性值使用。

(2)在CSS3稳定版草案中对多图片背景制定了规范： background-image属性可以通过"`,`"来分隔多个图像url设置多个背景图像。例如一下四个`linear-gradient`相当于background-image属性的四个值：

``` css

	div {
	  background: 
	  linear-gradient(120deg, transparent 75%, yellow 75%) -50px -23px, 
	  linear-gradient(120deg, transparent 75%, yellow 75%) 50px -196px, 
	  linear-gradient(240deg, transparent 75%, yellow 75%) -50px -23px, 
	  linear-gradient(240deg, transparent 75%, yellow 75%) 50px -196px, 
	  black;
	  background-size: 200px 346px; 
	}
```

每一个图像背景就创建了一个背景层（background layer），有几个背景图片就定义了几个层。background-image图片列表中第一个图像离用户最近，最后的图像离用户最远，background-color在离用户最远的背景图像下面，border-color和border-image在第一个背景图像上面，类似ps中的图层的概念。


如果一个图像（比如URI无效）不能成功加载出来，浏览器会将对应background-image的值认定为none（对应的图层还是存在的），表示图片丢失，但不影响其他背景图片的渲染和呈现。由于网络会存在不稳定导致背景图像加载不出来，所以始终应该提供background-color。

background-position,background-origin,background-repeat等属性的值也要相应地进行设置，也是用"`,`"分隔开。所以css代码中的` -50px -23px`部分，相当于在设置每一个background-image值对应的background-position值。

参考博客[background复合属性详解（上）：background-image](https://www.cnblogs.com/suspiderweb/p/5043686.html)

具体代码如下：

``` html

	<!DOCTYPE html>
	<html lang="en">
	
	<head>
	    <meta charset="UTF-8">
	    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	    <meta http-equiv="X-UA-Compatible" content="ie=edge">
	    <title>使用background linear-gradient绘制核辐射图标</title>
	    <!-- <link rel="stylesheet" href="style.css"> -->
	    <style type="text/css">
	        html {
	            height: 100%;
	        }
	
	        body {
	            height: 100%;
	            display: flex;
	            justify-content: center;
	            align-items: center;
	        }
	
	        div {
	            width: 300px;
	            height: 300px;
	            border-radius: 50%;
	            border: solid 1px white;
	        }
	
	        div {
	            background: linear-gradient(120deg, transparent 75%, yellow 75%) -50px -23px,
	            linear-gradient(120deg, transparent 75%, yellow 75%) 50px -196px,
	            linear-gradient(240deg, transparent 75%, yellow 75%) -50px -23px,
	            linear-gradient(240deg, transparent 75%, yellow 75%) 50px -196px,
	            black;
	            background-size: 200px 346px;
	        }
	    </style>
	</head>
	
	<body>
	    <div></div>
	</body>
	
	</html>
```