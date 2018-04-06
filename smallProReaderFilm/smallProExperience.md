【微信小程序开发者工具 版本 v1.02.1803210】

**1、关于调试**

打断点要在调试器的xxx.js?[sm]文件中，后缀带有[sm]的js文件才是对应的源文件，不带[sm]后缀的js文件(即跟编辑器里的文件同名的js文件是编译过的了)。

关于断点调试的快捷键： 单步调试 F10， 跳到下一个断点 F8

调试器的Storage可以查看本地的缓存数据， AppData存放跟页面相关的数据。

**2、关于样式(.wxss文件)**

页面的.wxss中定义的样式优先级要高于全局的app.wxss中定义的样式。

**3、关于页面**

应用程序的入口(app) ---> 一级页面(.wxml .wxss .js .json) ---> 二级页面(.wxml .wxss .js .json) --->...纵向最多五级

项目初始化的示例应用中，logs页面是index页面的子页面，index是一级页面，logs是二级页面。在index主页面点击，即可进入logs页面查看登陆日志记录。

同一页面目录下的四个文件(.wxml .wxss .js .json)名要相同，页面目录文件夹的名称可以和里面的文件名称不同。

**4、注册页面打开路径**

在app.json中注册小程序的页面路径，且 pages的数组中的第一个页面默认为小程序启动后的第一个页面.

**5、组件**

`<view>`组件类似html中的`<div>`元素，起到容器的作用。

**6、根目录**

如果在根目录下的pages/welcome/welcome.wxml中引用根目录下的images文件夹下的图片，那么image组件的src属性的绝对路径为`/images/picture.jpg`，如果使用相对路径，即为`../../images/picture.jpg`。

**注意**：(1)只有在`<text>`组件中包围的文字，才能在小程序中长按选中；可以通过嵌套`<text>`的方式，设置文字的不同颜色；`<text>`中的文本如果包含 `\n`这样的转义字符时，会编译换行，而不是显示文字字面量。

(2)新的尺寸单位rpx，规定屏幕宽度为750rpx，根据屏幕宽度自适应。iPhone6屏幕宽度375pt,共有750个物理像素，即750rpx=375pt=750px。

(3)如果是静态样式即以后不会改动的样式，写在外部样式表即.wxss文件中，如果是变化经常变动的样式，写在内联的style样式中。

(4)页面布局使用弹性盒子布局，即`display: flex; flex-direction: column; align-items: center;`可以实现元素的垂直居中分布。

(5).wxml中，在每个页面最外层(即在自己定义的组件的最外面)默认包裹一个page容器，可以在page中设置整个页面全局的背景色等。

(6) 快捷键的命令面板 按F1，或者右键命令面板

(7)设置元素之间的垂直间距margin时，宜使用固定不变的px，而不是自适应的rpx，以保证元素之间间距的可控性。水平方向的margin值宜使用rpx，视具体情况而定。

(8) 小程序不支持webview。
# 移动设备的分辨率与rpx #
**分辨率 pt 和 px的区别(以iPhone6为例)：**

pt(point)， 逻辑像素/设备独立像素，和屏幕的物理宽度有关,可以理解为长度和视觉单位，(375 x 667)。

px(pixel)， 物理像素/设备像素，和屏幕的物理宽度无关，表示一个相对大小，也受分辨率的影响(750 x 1334)。

iPhone6/6s的Retina屏，一个逻辑像素点中包含两个物理像素点，即1pt = 2px(横向或纵向方向上),已经达到人眼分辨率效果的极限，再增加比如iPhone6/6s Plus的 Reader=3x，人眼也不会看得出更加清晰。

css像素，以iPhone6/6s的Retina屏为例，1个css像素=4个物理像素。所以Retina屏（@2x）通常设计稿的图片大小为2倍的逻辑像素/css像素即750 x 1334，以保持和物理像素一致才不会失真保持高清，相当于放大图片不失真的效果。


**[这几个概念太晕了？？？逻辑像素、物理像素(设计稿的视觉尺寸)、css像素](http://div.io/topic/1092)**

## 如何做不同分辨率设备的自适应 ##

以iPhone6的物理像素750x1334为视觉设计稿进行设计，而在小程序中使用**rpx**为单位。

iPhone6下，`1px=1rpx=0.5pt`。

使用rpx，小程序会自动在不同的分辨率下进行转换，而使用px为单位不会。

**注意** 不是所有单位都适合使用rpx，尤其是文字，在不同机型下自适应时文字大小会变化，可能会自适应的很小。

# 编写新闻阅读列表 #

## swiper组件实现图片轮播 ##
[swiper滑块视图容器](https://mp.weixin.qq.com/debug/wxadoc/dev/component/swiper.html)，有很多属性，在一个`<swiper>`组件中可以有很多个`<swiper-item>`，即很多张图片，swiper-item仅可放置在`<swiper/>`组件中，宽高自动设置为100%。

**注意：**(1) swiper组件的高宽要设置在swiper上，swiper-item作为swiper的子集继承swiper的高宽， 但swiper-item中的图片不会继承设置在swiper上的宽高，所以还是需要在`<image>`组件上设置图片的宽高。

``` js
	<view>
	    <swiper style="width:100%;height:500rpx">
	        <swiper-item>
	            <image src='/images/swiper1.jpg' style="width:100%;height:500rpx"></image>
	        </swiper-item>
	
	        <swiper-item>
	            <image src='/images/swiper2.jpg' style="width:100%;height:500rpx"></image>
	        </swiper-item>
	
	        <swiper-item>
	            <image src='/images/swiper3.jpg' style="width:100%;height:500rpx"></image>
	        </swiper-item>
	    </swiper>
	</view>
```
(2) 小程序中还是可以使用sass、 less，但预编译以后的文件后缀要改为.wxss而不是.css， .css识别不了。

**swiper的属性**： `indicator-dots="true" autoplay='true' interval='2000' circular='true'`显示面板指示点、自动播放、衔接滑动(即滑动到最后一张紧接着后面是第一张)

(3)可以在页面的.json文件中配置不同于全局的导航栏颜色，不需要加window，直接将window下要配置的属性平铺开即可，因为页面下的.json文件中只能配置window的相关属性，不能配置pages、toolBar等其他的。

## 小程序的生命周期 ##

**顺序：** onLoad()页面加载 ---> onShow()页面显示 ---> onReady()页面初次渲染完成

**数据绑定：** 小程序没有DOM！！！！！小程序的思想借鉴了Angular.js(双向数据绑定)，采用数绑定的方式更新视图层。但小程序的数据绑定是单向的，即当.js脚本文件的数据改变时会自动同步更新到.wxml的双花括号中的变量，视图层更新；但当因为用户的操作，比如文本框输入数据之类的操作改变视图层时，无法将数据同步到.js文件中，而是采用事件机制传递数据。

**注意：**如果要设置某个属性为false，则要将false用双花括号包裹起来。否则，没有效果。因为小程序在解析属性时，是将它当作json字符串来解析的，所以即使属性设置为false，还是一个非空的字符串，转化为布尔值为true。但如果属性值要设置为true，那加不加双花括都可以，因为转化为布尔值都为true。如下：```<swiper vertical="false">```即使设置属性为false了，还是垂直轮播效果，垂直轮播效果并没失效。若要取消垂直轮播，则false要加双花括号，即```<swiper vertical="{{false}}">```。其他设置为false值得属性也是如此，要加双花括号才可以生效。

## 控制标签元素得显示和隐藏 ##
通过给组件添加属性 ```wx:if="{{value}}"```得形式，如果属性wx:if的值value为true，则显示该组件，否则value为false则隐藏该组件。

双花括号中可以做简单的运算。

# 页面跳转 #
由开始的欢迎引导页跳转到文章列表页(主页面)。

**wx.navigateTo和wx.redirectTo区别：**

navigateTo从主页面跳转到子页面，点左上角的返回可以子页面再回到主页面。而redirectTo是单向的，页面跳转之后回不到跳转之前的页面。由于我们的引导页面并不是主页面，只是一个附属页面，希望跳转到主页面(文章列表页)，因此要使用redirectTo。

在当前页面执行redirectTo到一个平行页面，会触发当前页面生命周期的onUnload()函数。而在当前页面执行navigateTo，会触发当前页面生命周期的onHide()函数，当前页面只是被隐藏了，以准备可以从子页面随时切换回该页面。

## 事件绑定 ##
在给组件绑定事件时，通过在组建添加属性`bind事件名`给组件绑定事件，例如给view组件添加手指轻触事件，`<view bindtap="callback">`。

像tap、thouchmove这些属于[冒泡事件](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxml/event.html)，而表单组件`<form/>`的submit事件等属于非冒泡事件。

如果要阻止事件冒泡，则在给组件绑定事件时，添加的属性为`catch事件名`，`<view catchtap="callback">`。

# 数据处理 #
在本地建立data/post.js文件即本地数据库，模拟从服务器传来的数据。

怎么使用本地数据库中的文件呢？利用模块导出和导入。

**注意**： (1)导入文件模块时即require一个模块时只能使用相对路径，不能使用绝对路径。

(2)小程序总是会读取data对象来做数据绑定，而读取data对象这个动作是在onLoad()事件执行之后发生的，所以可以在onLoad()函数中执行同步数据绑定时可以对data对象赋值，例如`this.data.postList = postData.postList;`，而不必一定使用`this.setData()`去更新data对象；但如果在onLoad()函数中执行异步操作时进行数据绑定，即需要在异步函数中更新data对象时，不能使用`this.data.postList = postData.postList;`这种赋值的方式，必须使用`this.setData()`方法去更新data对象。 如果为了防止出错，也可以都使用`this.setData()`去设置更新数据data对象。

**注意**，以上关于设置data对象中数据在同步操作时可以采用赋值的方式，为慕课网上一名老师所讲，我自己在做时发现，即使数据量不是很大时，采用`this.data.postList = postData.postList;`方式更新数据也会很慢，有延迟，导致页面一片空白，而使用`this.setData()`去设置data对象就不会。所以建议还是使用`this.setData()`，也不是很麻烦。

# 标签和样式模板文件 #
(1).wxml标签模板文件通过`<template name="postItem"></template>`定义，后缀也是.wxml。在需要引入该模板的文件中，使用`<import src="post-item/post-item-template.wxml" />`引入该模板文件(绝对路径也可以)，然后在需要使用模板的地方使用如下代码引入：

	<!--文章列表  -->
	<view wx:for="{{posts_key}}" wx:for-item="item" wx:for-index="idx">
	    <!--引用postItem模板  -->
	    <template is="postItem" data="{{item}}" />
	</view>

其中template的`is`属性为要使用的模板名称，`data`属性为要传入模板的数据。注意：引入的模板文件内部，使用的图片等文件路径最好不要使用相对路径，因为模板文件可能被引入到很多地方，所以相对路径可能导致找不到对应的资源，最好使用绝对路径，便于将来模板的复用。

**注意：**引入脚本文件模块时，即require()必须使用相对路径；而引入.wxml模板文件时，相对路径和绝对路径均可。

(2)引入.wxss样式模板文件使用 `@import "post-item/post-item-template.wxss";`。

(3)小程序并没有实现脚本文件的模板化，即不能像引入样式和标签模板一样去复用脚本代码。

# 文章详情页面的实现 #
**注意：** `<template />`标签相当于占位符，在编译完之后就消失了，因此不能在`<template />`上绑定事件，可以使用一个`<view>`标签包裹起`<template />`模板，在view上绑定事件，还可以将部分数据作为属性值(自定义属性如 data-postId)传递给view标签，比如文章id，因为点击不同的文章要显示不同的文章详情,如下：

``` js
	<view catchtap='onPostTap' data-postId="{{item.postId}}">
```

然后通过事件对象event获取到通过自定义属性传入的数据，` var postId = event.currentTarget.dataset.postid;`。但要**注意**data-自定义属性的值比如这里的双花括号里的`item.postId`中的大写字母会一律转化为小写，因此在脚本文件中通过event获取自定义属性中的数据时，要使用小写的形式`postid`。

## 如何从文章列表页跳转到文章详情页 ##
从文章列表页进入文章详情页，需要知道加载哪一篇文章，即需要传递文章的id，在列表页路由切换时，通过url路径的查询参数传递文章id数据，如下所示：

``` js
	//在列表页点击某篇文章区域，进入文章详情页
	  onPostTap: function(event) {
	      var postId = event.currentTarget.dataset.postid;
	      wx.navigateTo({
	          url: 'post-detail/post-detail?id=' + postId,
	      });
	    }
```
然后在文章详情页，加载页面事件中通过options获取url查询字符串中的id字段值，如下：

``` js
	  onLoad: function (options) {
	    // 通过url的查询参数获取文章id数据
	    var postId = options.id;
	    console.log(postId);
	  }
```
## 如何从轮播图swiper组件跳转到对应的文章详情页 ##
即在swiper组件上，绑定`catchtap='onSwiperTap'`事件，以及在对应的swiper-item上绑定图片对应的`data-postId`，当点击轮播图时进入对应的文章详情页。.wxml代码如下：

``` js
<swiper catchtap='onSwiperTap' indicator-dots="true" autoplay='true' interval='5000' circular='true'>
        <swiper-item>
            <image src='/images/swiper1.jpg' data-postId="0" ></image>
        </swiper-item>

        <swiper-item>
            <image src='/images/swiper2.jpg' data-postId="1"></image>
        </swiper-item>

        <swiper-item>
            <image src='/images/swiper3.jpg' data-postId="2"></image>
        </swiper-item>

        <swiper-item>
            <image src='/images/swiper4.jpg' data-postId="3"></image>
        </swiper-item>
</swiper>
```
onSwiperTap()实现如下：

``` js
onSwiperTap: function(event) {
        var postId = event.target.dataset.postid;
        wx.navigateTo({
            url: 'post-detail/post-detail?id=' + postId,
        });
    }
```
**注意**：

(1)区别currentTarget和target, target指当前点击的组件，currentTarget指事件捕获时所在的组件。这里target指`<swiper-item>`组件，currentTarget指`<swiper>`组件。

(2)组件的`bindtap`属性不会阻止事件冒泡，而`catchtap`会阻止事件冒泡。

# 文章收藏功能 #
当用户点击收藏按钮后，小程序应该向服务器发送一个收藏或者取消收藏的信息，让服务器更新用户的数据。但由于没有服务器，因此利用缓存来记录用户状态模拟该过程。

## 缓存 ##
在小程序中，如果用户不去主动清除缓存，缓存是一直存在的，缓存的上限量不超过10M。所以可以用来模拟用户的收藏和取消收藏状态。

**注意：**如果利用缓存存储了数据，当在模拟器修改了缓存数据再在真机运行的时候，真机还是运行的上次修改之前的缓存数据，并没有随模拟器的修改而改变，即使真机使用了微信的清除缓存数据功能，也还是使用的上次未修改之前的缓存数据，需要手动去清除缓存数据，即可以设置一个按钮，利用`wx.clearStorage`清除真机上的缓存数据。

同步设置缓存的方法如下，异步设置不加后缀Sync，参数为key(string类型),Object/String。

    // 设置缓存
    wx.setStorageSync('key', "绝地求生");

更新缓存数据状态时，还是如上，使用一样的键，新的数据即可，如下：

    // 更新缓存
    wx.setStorageSync('key', {
        game: "绝地求生"
    });
如何在脚本中获取缓存数据呢？同步获取缓存数据的方法如下，参数即为设置缓存时的键：

    onCollectionTap(event) {
        var game = wx.getStorageSync('key');
        console.log(game);
    }
清除缓存的方法：可以清除缓存中的某一项数据，也可以清除全部缓存，同步方法如下：

        wx.removeStorageSync('key'); //清除某项缓存
        wx.clearStorageSync(); //清除所有缓存

## 图片的显示隐藏 ##
由于在小程序中不能使用操作DOM的方法动态改变图片的src属性来实现图片的显示和隐藏，小程序中没有dom操作方法，都是基于数据绑定的思想，数据优先的原则。可以在组件上使用`wx:if`这样的属性，动态改变数据的状态。如下：

``` js
    <image wx:if="{{collected}}" src='/images/icon/collection.png' catchtap='onCollectionTap'>收藏图标</image>
    <image wx:else src='/images/icon/collection-anti.png'></image>
```

如果收藏状态为真，则加载collection.png，否则未收藏则加载collection-anti.png。

缓存中设置所有用户的文章是否被收藏的状态格式如下：

    // var postsCollected = {
    //     0: true,
    //     1: false,
    //     2: true,
    //     3: false
    // };

从缓存中读取用户文章的收藏状态：

``` js
	// 从缓存中读取所有用户文章的收藏状态
    var postsCollected = wx.getStorageSync('posts_collected');

    // 获取当前用户的文章收藏状态
    if (postsCollected) {
        var postCollected = postsCollected[postId];
        this.setData({
            collected: postCollected
        });
    } else { //如果缓存中没有postsCollected对象，即所有用户的文章均未被收藏过
        var postsCollected = {};
        postsCollected[postId] = false;

        // 将当前文章的收藏状态写入缓存
        wx.setStorageSync('posts_collected', postsCollected);
    }
```

**怎么从onLoad()函数中将postId参数传递到事件处理函数onCollectionTap()中呢？**解决方法，可以借助data临时中转以下，将postId存入data,在onCollectionTap()通过data对象获取到postId。

点击收藏图标的事件处理函数如下：

``` js
	 // 用户点击收藏按钮事件
	 onCollectionTap: function(event) {
	    // 获取缓存数据，查看所有文章的收藏状态
	    var postsCollected = wx.getStorageSync('posts_collected');
	
	    // 当前文章的收藏状态,借助data对象获取当前文章的postId
	    var postCollected = postsCollected[this.data.currentPostId];
	
	    // 将收藏状态取反
	    postCollected = !postCollected;
	
	    // 更新收藏状态的缓存
	    postsCollected[this.data.currentPostId] = postCollected;
	    wx.setStorageSync('posts_collected', postsCollected);
	
	    // 更新数据绑定变量data对象的收藏状态，从而实现切换图片
	    this.setData({
	        collected: postCollected
	    });
```

## 收藏成功通知功能 ##
利用小程序提供的API的功能，

`wx.showToast(OBJECT)`显示消息提示框，显示一段时间自动消失，不需要用户确认。利用该API实现收藏成功通知。

``` js
        // 通知用户收藏成功
        wx.showToast({
            title: postCollected ? "收藏成功" : "取消成功",
            duration: 1000,
            icon: "success"
        })
```

`wx.showModal(OBJECT)`，​显示模态弹窗，如果不手动关闭不会自动消失,需要用户确认。如下使用：

``` js
    // 显示模态弹窗
    showModal: function (postsCollected, postCollected) {
        var that = this; //保存this 的上下文环境， that表示Page的上下文
        wx.showModal({
            title: '收藏',
            content: postCollected ? '收藏该文章？' : '取消收藏该文章？',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#333',
            confirmText: '确认',
            confirmColor: '#405f80',
            success: function(res) {
                if (res.confirm) { //如果用户确认收藏

                    // 更新收藏状态的缓存值
                    wx.setStorageSync('posts_collected', postsCollected);

                    // 更新数据绑定变量data对象的收藏状态值，从而实现切换图片
                    that.setData({
                        collected: postCollected
                    });
                }
            }
        })
    }
```
但此处还是使用showToast()要更加合适一些。

``` js
// 显示消息提示框，包括更新收藏状态的缓存、通知用户收藏成功
    showToast: function (postsCollected, postCollected) {

        // 更新收藏状态的缓存值
        wx.setStorageSync('posts_collected', postsCollected);

        // 更新数据绑定变量data对象的收藏状态值，从而实现切换图片
        this.setData({
            collected: postCollected
        });

        // 通知用户收藏成功
        wx.showToast({
            title: postCollected ? "收藏成功" : "取消成功",
            duration: 1000,
            icon: "success"
        });
    }
```

## 同步与异步方法对比 ##
同步方法获取缓存中的文章收藏状态，并更新缓存文章收藏状态，显示收藏成功通知，如下：

``` js
 getPostsCollectionSync: function() {

        // 获取缓存数据，查看所有文章的收藏状态
        var postsCollected = wx.getStorageSync('posts_collected'); //同步获取缓存数据

        // 当前文章的收藏状态,借助data对象获取当前文章的postId
        var postCollected = postsCollected[this.data.currentPostId];

        // 将收藏状态取反
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;

        // 显示收藏成功通知
        this.showToast(postsCollected, postCollected);
    }
```
异步方法获取缓存中的文章收藏状态，并更新缓存文章收藏状态，显示收藏成功通知，如下：

``` js
 getPostsCollectionAsyn: function() {
        var that = this;
        wx.getStorage({
            key: 'posts_collected',
            success: function(res) {

                // 获取缓存数据，查看所有文章的收藏状态
                var postsCollected = res.data;

                // 当前文章的收藏状态,借助data对象获取当前文章的postId
                var postCollected = postsCollected[that.data.currentPostId];

                // 将收藏状态取反
                postCollected = !postCollected;
                postsCollected[that.data.currentPostId] = postCollected;

                // 显示收藏成功通知
                that.showToast(postsCollected, postCollected);
            },
        });
    }
```

**关于同步和异步方法的选取**：能使用同步方法尽量使用同步方法，异步方法不好调试，异步方法的选取跟业务逻辑有关，视业务需求而选取异步方法。比如在购物平台订单的处理，你提交订单到服务器，服务器先发给你一条订单提交成功，订单就进入了服务器端的订单处理队列，然后服务器就以异步方式处理该订单。

本小程序主要使用了同步的方法。

# 音乐播放功能 #
有两类实现音乐播放功能的方法，一类是利用小程序提供的`<audio>`组件，另一类是音乐播放控制API，如`wx.playBackgroundAudio(OBJECT)`。

**注意：**再利用API`wx.playBackgroundAudio(OBJECT)`实现音乐播放时，音乐不能存储在本地，即`data	Url`的值不能是本地路径，必须是流媒体文件，即音乐链接，因为小程序的大小最多2M，音乐文件在本地的话太大了，同样`coverImgUrl`也必须使用链接，不能用本地的图片。而且`coverImgUrl`的效果在模拟器上看不到，必须在手机上才能看到，但能在主控制器弹框里看到。

**神奇的事情发生了！！！**就在上面设置了音乐的外链之后，点击了好多遍，音频主控器弹框闪一下就不见了，也没音乐，我以为是链接的问题，于是换了另一首歌的链接，这是音乐响起，我以为好了，可是没过两秒，之前设置的那首歌响起了，并且点击音乐主控器也关不掉，于是把开发者工具也关了，但音乐还是停不下来啊。打开任务管理器，也没看到小程序还有什么残留的音频播放相关的进程。头疼的找了半天，然后我终于发现了，是特么我找音乐链接的那个网页在自动播放音乐，真的是蠢货如我，但这种自动播放音乐的网页现如今也是很反人类了！！！

如果不在页面中设置音乐停止播放的功能，那么音乐会一直播放，音乐播放的主控器弹框只会在微信主页中才会看的到，所以在文章详情页，也要实现停止音乐播放的逻辑。

音乐播放暂停的代码如下：

``` js 
onMusicTap: function(event) {
        var isPlayingMusic = this.data.isPlayingMusic; //音乐是否正在播放的状态

        if (isPlayingMusic) {
            wx.pauseBackgroundAudio();
            this.data.isPlayingMusic = false;
        } else {

            // 开始播放音乐
            wx.playBackgroundAudio({
                dataUrl: 'http://sc1.111ttt.cn/2016/1/01/22/194220756552.mp3',
                title: 'Vincent',
                coverImgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1522337771064&di=2aa31c2873ca32d75d1d3c97419ebee2&imgtype=0&src=http%3A%2F%2Fimg4.duitang.com%2Fuploads%2Fitem%2F201205%2F09%2F20120509001948_T2rF8.thumb.700_0.jpeg'
            });
            this.data.isPlayingMusic = true;
        }       
    }
```

## 音乐播放暂停图标的切换 ##
不再利用`wx:if`属性实现图片切换了，换一种方法。利用数据绑定，根据音乐是否正在播放的状态值，动态改变图片的`src`属性，从而实现图片切换，实现如下：

``` js
<image class='audio' src="{{isPlayingMusic ? '/images/music/music-stop.png' : '/images/music/music-start.png'}}" catchtap='onMusicTap'></image>
```

**注意：**(1)如果不是在onLoad()中做数据绑定的话，不能使用赋值的方式更新data对象，即不能使用`this.data.isPlayingMusic = false;`这种方式，必须使用`this.setData()`方法。

(2)音乐数据也要模仿是从服务器传过来的，所以也要将音乐数据存放在本地数据库中，然后根据不同的文章id获取相应的音乐数据。

## 音乐总控开关与页面音乐控制按钮同步 ##
即点击总的音乐控制器开关时，页面的音乐控制按钮的切换也要与总控开关对应。

	wx.onBackgroundAudioPlay(CALLBACK)
	监听音乐播放。
	
	wx.onBackgroundAudioPause(CALLBACK)
	监听音乐暂停。(下次播放接着本次暂停的地方)

利用以上API方法，在onLoad()中设置`isPlayingMusic`的值，代码如下，即可实现音乐播放总控制器开关与页面音乐播放开关同步：

``` js
 // 使音乐总控开关与页面音乐控制按钮同步
    var that = this;
    wx.onBackgroundAudioPlay(function() {
        that.setData({
            isPlayingMusic : true
        });
    });
    wx.onBackgroundAudioPause(function() {
        that.setData({
            isPlayingMusic : false
        });
    });
```
以上方式利用了事件机制的思想，实现了模块之间的松耦合，使得框架通过监听事件例如`onBackgroundAudioPlay`，利用自己编写的代码。也体现了小程序数据优先的思想，通过改变数据绑定的状态，例如这里的`isPlayingMusic`为`true`或是`false`，动态改变页面的显示效果，而不是像jQuery是通过操作DOM的思想。采用数据绑定的方式，实现了js与页面结构的松耦合，使得单元测试得以进行。

## 页面关闭后，记录音乐播放状态 ##
如果文章详情页音乐正在播放，当返回列表页然后再重新进入详情页之后，会看到音乐虽然还正在播放，但是图标却变成了停止播放时的音乐图标，这是因为返回到列表页相当于关闭了详情页，再进入详情页时，详情页重新初始化，导致音乐虽然还在播放，但是播放图标却是初始化后的停止图标。这是由于音乐播放的特性，退出当前页面音乐播放依旧在进行，但再进入时页面却要初始化(音乐还在播放)，使得播放图标恢复到初始化时的停止样式图标。

**实现与页面无关的音乐播放状态的保存**： 

(1)即当文章详情页关闭后，要保存音乐播放状态，这样再次进入详情页后音乐播放图标显示为保存的播放状态对应的样式。

(2)不可以使用缓存来保存音乐播放状态，因为缓存在小程序关闭之后依然存在，如果音乐正在播放时关闭小程序，这样当小程序再次打开进入到详情页后，由于缓存不会被清除也不会恢复到默认状态，所以读到的音乐播放状态为正在播放，但是这是不符合要求的。

(3)需要的保存状态应该在关闭当前页面即文章详情页时保存，但当小程序关闭时，这些保存的状态应该全部清除恢复到默认状态。

所以缓存和页面的私有变量都不能实现(3)中的要求，可以考虑使用一个与应用程序生命周期结合的全局变量实现该要求，可以在app.js中定义该全局变量。`App({})`中的js对象定义了小程序的生命周期，在`Page({})`中定义页面的生命周期。

通过` wx.onBackgroundAudioPlay()`监听音乐播放状态相应地改变全局保存音乐播放状态的变量`app.globalData.g_isPlayingMusic`，在详情页的onLoad()函数中，根据全局全局播放状态变量改变页面私有的音乐播放状态变量`this.data.isPlayingMusic`，使得再次进入详情页时播放图标与退出之前保持一致。

问题：由于`app.globalData.g_isPlayingMusic`记录的是上一次退出的文章(A)的音乐播放状态，如果紧接着再次进入A文章，会看到音乐播放图标是正在播放，但如果是紧接着进入别的文章页面(比如B文章、C文章)，那么会看到音乐播放图标也是正在播放，这是不正确的，应该再创建一个全局变量 `g_currentMusicPostId`记录到底是哪一篇文章的音乐在播放，这样在退出当前文章页再进入别的文章页时，别的文章页的音乐图标播放状态不受当前要退出的文章页的音乐播放状态的影响。

**小程序的生命周期App({})：**

`onLaunch()`：当小程序初始化完成时，会触发 onLaunch（全局只触发一次）

`onShow()`: 当小程序启动，或从后台进入前台显示，会触发 onShow

`onHide()`: 当小程序从前台进入后台，会触发 onHide

在开发者工具中，点击编译后，依次执行的是 `onLaunch()` --> `onShow()`，此后如果不再点击编译，即不再进行小程序的初始化，不会再触发`onLaunch`（全局只会触发一次），只会在切换前后台时触发`onShow()`和`onHide()`。

# Tab栏的实现 #
通过在[app.json文件中](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html)设置`tabBar`对象，可以设置tab选项卡的跳转路径，以及一些样式。如下所示：

``` js
"tabBar": {
        "borderStyle": "white",
        "list": [
            {
                "pagePath": "pages/posts/post",
                "text": "阅读",
                "iconPath": "/images/tab/yuedu.png",
                "selectedIconPath": "images/tab/yuedu_hl.png"
            },
            {
                "pagePath": "pages/movies/movies",
                "text": "电影",
                "iconPath": "/images/tab/dianying.png",
                "selectedIconPath": "images/tab/dianying_hl.png"
            }
        ]
    }
```

**注意：**redirectTo和navigateTo不能再跳转到带有tab选项卡的页面，要使用wx.switchTab，专门用来跳转到带有tabbar的页面。如下：

``` js
  onTap: function(event) {
      
    //  redirectTo和navigateTo不能再跳转到带有tab选项卡的页面，要使用wx.switchTab，专门用来跳转到带有tabbar的页面
    wx.switchTab({
        url: '../posts/post',
    });
  }
```

# 电影页面的实现--主页及电影分类页 #
从[豆瓣的真实API](https://developers.douban.com/wiki/?title=api_v2)获取电影相关数据。

## 使用嵌套template实现页面 ##
movie-list --> movie --> stars, movie grid

从最小的template写起，即从`stars`模板开始写起。并且写完最小的模板的结构之后，不着急添加样式，先把上一层嵌套的模板(movie)的结构写出来,再接着写上一层的movie-list模板。接下来，在movies.wxml中引入 movie-list组件，然后进行静态样式的布局。

嵌套关系如下，从最小的模板文件写起，即stars-template.wxml --> `<import src="../stars-template/stars-template.wxml" />`(movie-template.wxml) --> `<import src="../movie-template/movie-template.wxml" />`(movie-list-template.wxml) --> `<import src="movie-list-template/movie-list-template.wxml" />`(movie.wxml)

**注意：**进行数据绑定时，正好是相反的过程，自顶向下进行数据绑定。编写模板文件是自底向上。

## 从豆瓣API服务器获取数据 ##
### restful API 与 SOAP 对比 ###
都是用来从服务器获取数据。一般使用 **restful(Representational State Transfer，表述性状态传递)** API返回JSON格式的数据，**SOAP(Simple Object Access Protocol，简单对象访问协议)** 返回XML格式的数据，restful接口比较轻量级，SOAP已被restful取代，互联网公司的公开API一般都是采用restful风格的，SOAP只用在少数企业级API中。参考博客[Soap 和 Rest 的区别](https://blog.csdn.net/defonds/article/details/49000993)。

好的restful API一般是自描述的，即通过接口的url即可大致知道这个接口的功能；接口粒度的控制。

### 小程序的网络请求 ###
参考小程序API [wx.request(OBJECT)](https://developers.weixin.qq.com/miniprogram/dev/api/network-request.html)。如下，注意：豆瓣的免费API好像对小程序限制了，因此使用了[github上用ngix反向代理服务器](https://github.com/zce/weapp-demo)，豆瓣API的基地址由`https://api.douban.com`换为`https://douban.uieee.com`。

``` js
   onLoad: function (options) {
      wx.request({
          url: 'https://douban.uieee.com/v2/movie/top250',
          header: {
              'content-type': 'json'
          },
          method: 'GET',
          success: function(res) {
              console.log(res);
          },
          fail: function() {
              console.log("failed");
          }
      }); 
  }
```
**注意：**很坑爹的一点是，`'content-type': 'json'`这句，小程序官方文档内容类型json格式用的`application/json`，而这里使用`application/json`却会报400错误，将其改为`json`就正常了。。。。。。(心累.jpg T T)

另外，将豆瓣API的基地址提取出来放在app.js中作为全局变量。

**补充：**

(1) 在引入.wxss文件时，记得在末尾加分号，如`@import "movie-list-template/movie-list-template";`。

(2) 可以在豆瓣API的请求url上添加参数，以截取部分资源，避免资源浪费。比如在获取正在上映的影片时，默认返回20条电影数据，可以限制start和count只获取特定数目的电影数据。如下：只获取前三条正在上映的电影信息

``` js
 var inTheaterUrl = "https://douban.uieee.com" + "/v2/movie/in_theaters" + "?start = 0&count=3";
```
### 豆瓣数据的处理 ###
由于豆瓣返回的数据包含的值不统一，有些值为空，所以要对其进行处理。例如以下对部分数据的处理：

``` js
processDoubanData: function(moviesDouban) {

    var movies = []; //用于存放获取的电影列表的相关有用数据
    for (var index in moviesDouban.subjects) {
        var subject = moviesDouban.subjects[index];
        var title = subject.title;
        if (title.length >= 6) {
            title = title.substring(0, 6) + "...";
        }

        // 存放需要用到的每个电影的数据到一个临时对象
        var temp = {
            title: title,
            average: subject.rating.average,
            coverageUrl: subject.images.large,
            movieId: subject.id
        };

        // 将临时对象中每个电影的数据push进movies数组
        movies.push(temp);
    }
    this.setData({
        movies: movies
    });
  }
```
然后利用data对象中的movies数据进行数据绑定。

**注意踩坑！！** 在使用`wx:for`属性进行列表渲染时，注意`wx:for`属性的值用花括号包裹，然后面的`wx:for-item`属性的值却不能用双花括号包裹，只用引号即可。我一直以为`wx:for-item`的值是变量需要双花括号包裹，结果没有视图效果，调了好久才发现这个坑。。。如下使用列表渲染：

``` js
<block wx:for="{{movies}}" wx:for-item="movie">
```

**注意调试技巧！！**在AppData中可以看到页面data对象中的数据，我还是傻子一样为了看data对象中是否加载了数据，一路console.log调试了好久。。。。

**补充：**

在`movies.js`文件中，注意下面往data对象中存的不同类别的电影 正在上映/即将上映/top250中，为了方便数据绑定data对象中的数据结构如下所示：

``` js
	  // 将不同类别的movies数组存进data对象
	    var readyData = {};
	    readyData[category] = {
	        movies: movies
	    };
	    this.setData(readyData);
```
data对象的数据结构形式为：

``` js
	data: {
	    inTheaters: {
	        movies: [movie1, movie2, movie3]
	    },
	
	    comingSoon: {
	        movies: [movie1, movie2, movie3]
	    },
	    top250: {
	        movies: [movie1, movie2, movie3]
	    }
	}
```
其中movies数组中的每一个movie均为包含一系列属性(title, coverageUrl, movieId等等)的对象。

### 评分星星组件的实现 ###
暂时不考虑半颗星星(因为没准备半颗星星的图片)，即3.5颗星就当作3颗星，并将整颗的星星转化为数组的形式，例如5颗星星表示为[1,1,1,1,1]，3颗星星表示为[1,1,1,0,0]。

在根目录下的utils文件夹下放一些公共的函数，处理星星评分转化为数组（数组中为1或0）的函数就放在公共的文件中utils/util.js，如下：

``` js
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

module.exports = {
    convertToStarsArray: convertToStarsArray
};
```
通过`wx:for`循环点亮星星，stars为一个长度为5，包含1或0的数组，通过`wx:if`实现高亮星星和非点亮星星的切换，如下所示：

``` js
<block wx:for="{{stars}}" wx:for-item="i">
	<image wx:if="{{i}}" src='/images/icon/star.png'></image>
	<image wx:else src='/images/icon/none-star.png'></image>
</block>
```

## 点击"更多"九宫格详情页面的实现 ##
通过利用`movie-template`模板封装一个九宫格`movie-grid-template`模板，因为在搜索电影页面中也会用到这样一个九宫格页面，所以封装成一个模板以待复用。

**注意：** 在点击“更多”时，要根据不同的电影分类，跳转到不同的的页面，所以要给跳转的页面路径传递参数加以区分，实现大致如下：

``` 
<!-- movie-list-template.wxml -->

<view class='more' catchtap='onMoreTap' data-category="{{category_CN}}">
    <text class='more-text'>更多</text>
    <image class='more-img' src="/images/icon/arrow-right.png"></image>
</view>
```

在movies.js中，点击"更多"页面跳转逻辑如下,其中绑定在view组件中的data-category属性用来传递电影分类，可以在点击事件的event.currentTarget.dataset中获取到：

``` js
onMoreTap: function (event) {
        var category = event.currentTarget.dataset.category;
        wx.navigateTo({
            url: 'more-movies/more-movies?category=' + category,
        })
    }
```
在more-movies.js文件中，获取页面跳转携带的电影分类参数如下：

``` js
  onLoad: function (options) {
    var category = options.category;
    console.log(category);
  }
```

### 动态设置导航栏标题 ###
当点击“更多”后，跳转到不同电影分类下的九宫格，导航栏要根据不同的电影分类显示不同的文字(正在上映/即将上映/好评榜)。

使用微信API`wx.setNavigationBarTitle(OBJECT)`，动态设置当前页面的标题。

**注意：**七月讲的在动态设置导航栏标题时，需要在页面生命周期的onReady函数中(页面生命周期： onLoad页面加载 --> onShow页面显示 --onReady页面初次渲染完成)设置才生效，但我自己试了下，在我使用的小程序版本中，在页面生命周期的以上三个阶段的任意一个阶段，均可成功动态设置导航栏的标题。设置如下：

``` js
 	 /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var category = options.category;
        console.log(category);

        // 动态设置当前页面导航栏的标题
        wx.setNavigationBarTitle({
            title: category,
        });
    }
```

### 在 more-movies页面根据不同分类加载电影数据 ###
使用switch语句，根据不同分类设置不同的请求路径。然后处理返回的请求数据。

因为在多个文件中使用到了`getMovieListData()`函数，用于从豆瓣API请求电影数据，因此将此函数提取出来改装一下，放到公共的util.js文件中，用于向某个API发送HTTP请求数据，以提高代码的复用。 util.js中代码如下：

``` js
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
	module.exports = {
	    convertToStarsArray: convertToStarsArray,
	    http: http
	};
```

### movie-grid-template模板的实现 ###
通过movie-grid-template模板中引入复用movie-template模板，在more-movie页面中引入复用movie-grid-template模板实现，相应的样式文件也是如此引入。

**九宫格样式的实现：**

注意(1)不能在`<template>`组件上添加样式，需要用一个`<view>`组件将`<template>`组件包裹起来，然后再给`<view>`组件添加样式。 

(2)flex布局对于scroll-view组件是无效的，所以为了实现上滑加载更多刷新，使用了float布局，而没有使用flex布局。

### 上滑 加载更多(懒加载) ###
每滚动一次加载20条电影数据，实现数据的加载刷新。

利用`<scroll-view>`组件，实现可滚动视图区域,view组件不能实现滚动。设置`<scroll-view>`组件的属性如下：`scroll-y="true" scroll-x="false" bindscrolltolower="onScrollLower"`。

**注意：**使用竖向滚动时，需要给`<scroll-view/>`一个固定高度，通过 WXSS 设置 height,iPhone6的物理像素750x1334。

通过onScrollLower事件监听是否滚动到底部，然后再向豆瓣API请求紧接着的接下来的20条数据。实现如下：

``` js
    /**
     * 监听sroll-view组件的scrolltolower 事件，实现下拉/上滑更新
     */
    onScrollLower: function(event) {
        var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";

        util.http(nextUrl, this.processDoubanData);
    }
```
其中start字段表示已经加载了的电影数据条数。nextUrl的`this.data.requestUrl`来自于：

``` js
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

        // 用于 onScrollLower中，处理每次下拉更新的requestUrl
        this.setData({
            requestUrl: dataUrl
        });
```
nextUrl的`this.data.totalCount`需要在processDoubanData()函数中处理，因为请求过来的每一条电影数据都经过了processDoubanData()函数的处理，如下所示：

``` js
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
```

### 设置上滑 加载更多 loding提示 ###
在发出电影数据url请求后，利用`wx.showNavigationBarLoading()`设置正在加载，当返回请求数据并处理完且更新了data对象的数据后，利用`wx.hideNavigationBarLoading()`取消正在加载。

### 下拉刷新 ###
在 more-movies.json配置文件中，开启下拉刷新。如下：

``` js
{
    "enablePullDownRefresh": true
}
```
然后监听页面的下拉刷新事件`onPullDownRefresh`，当处理完数据刷新后，`wx.stopPullDownRefresh`可以停止当前页面的下拉刷新。

**注意！！**微信130400版本更新后，如果页面包含scroll-view组件，无法实现下拉刷新`onPullDownRefresh`。scroll-view组件和onPullDownRefresh在130400版本里是冲突的。

**解决办法：**[130400版本更新导致下拉刷新和scroll-view不能同时使用](https://zhuanlan.zhihu.com/p/24739728?refer=oldtimes),不再使用scroll-view组件的`bindscrolltolower="onScrollLower"`方法，而使用页面的上拉触底事件`onReachBottom`实现上滑加载更多。

# 电影主页搜索功能实现 #
使用`<input>`组件实现电影主页的搜索栏的输入框，当点击了搜索栏的输入框(即输入框聚焦时，触发bindfocus事件)，切换到电影搜索页面，当搜索页面输入数据完成时，点一下空白的地方失去焦点或者点击手机键盘的完成的完成，触发bindblur、bindconfirm事件，完成数据采集。

电影搜索页面不再使用movies.wxml的子页面实现了，而直接在movies.wxml文件中添加实现该功能的组件，并控制该部分组件的显示和隐藏，以达到搜索框聚焦时，切换到电影搜索页面，失去焦点时，返回搜索结果。

movies.wxml中的结构如下，通过wx:if确定是container显示，还是搜索页面显示。

``` js
<view class='search'>
    <icon type='search' size='13' color='#405f80' class='search-img'></icon>
    <input type='text' placeholder='头号玩家' placeholder-class='placeholder' bindfocus='onBindFocus' bindchange='onBindChange'></input>
    <image wx:if="{{searchPanelShow}}" src='/images/icon/xx.png' bindtap='onCancelImgTap' class='xx-img'></image>
</view>

<view class='container' wx:if="{{containerShow}}">
    <view class='movies-template'>
        <template is="movieListTemplate" data="{{...inTheaters}}" />
    </view>
    <view class='movies-template'>
        <template is="movieListTemplate" data="{{...comingSoon}}" />
    </view>
    <view class='movies-template'>
        <template is="movieListTemplate" data="{{...top250}}" />
    </view>    
</view>


<view class='search-panel' wx:if="{{searchPanelShow}}">
    <template is="movieGridTemplate"></template>
</view>

```
movies.js中相关绑定数据的操作如下：

``` js
    /**
   * 电影主页搜索框聚焦时，电影内容页面隐藏，电影搜索页面显现，实现页面切换
   */
    onBindFocus: function (event) {
        this.setData({
            containerShow: false,
            searchPanelShow: true
        });
    },


    /**
     * 点击X符号，退出搜索页面，恢复到电影列表主页
     */
    onCancelImgTap: function(event) {
        this.setData({
            containerShow: true,
            searchPanelShow: false
        });
    }
```

## 通过豆瓣搜索API 实现电影搜索页面 ##
利用input组件的`bindinput`属性实现，当键盘输入字符变化时，触发onBindInput()事件，event.detail = {value, cursor}，处理函数可以直接 return 一个字符串，将替换输入框的内容。

`bindblur`输入框失去焦点时触发，event.detail = {value: value}。

`bindconfirm` 点击完成按钮时触发，event.detail = {value: value}。

**注意：**自己试验了下，在该版本的小程序上，在模拟器上，当在input输入框按回车时，会相继触发
`bindconfirm`、`bindblur`；而当在输入框之外的区域单击时，只会触发`bindblur`，不会触发`bindconfirm` 。所以为了真机响应键盘的"完成"按钮，最好使用`bindconfirm` 。

### 豆瓣电影搜索API ###
Resources URI： /v2/movie/search?q={text}。 在搜索框输入关键字时，向豆瓣API发送搜索数据。如下：

``` js
    /**
     * 在搜索框输入文字，从豆瓣搜索API返回数据
     */
    onBindInput: function(event) {
        var text = event.detail.value;
        var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
        this.getMovieListData(searchUrl, "searchResult", "");
    }
```

# 电影详情页面 #
**注意踩坑！！！**在.wxml中绑定的自定义传递数据的属性即data-xxxx，必须为小写，如果含有大写字母，在事件对象的dataset对象上获取该属性值时，该属性依然会被转换为小写，而此时你如果还是使用大写形式去获取属性值，将会得到undefined。例如，在.wxml绑定事件，并传递数据如下：

``` 
<view class='movie-container' catchtap='onMovieTap' data-movieId="{{movieId}}">
```
可以看到`data-movieId`属性中含有大写字母，在通过`event.currentTarget.dataset`获取该属性时，如果使用`event.currentTarget.dataset.movieId`将会得到undefined，因为此时的dataset对象的属性值已被转化为了小写形式，{movieid: "27592315"}。

## 豆瓣电影详情API ##
点击电影列表主页上某个电影缩略图，就会跳转到电影详情页，跳转路径上携带上该电影的id，好方便详情页去豆瓣API请求该部影片的数据。豆瓣电影详情API `/v2/movie/subject/:id`。

**注意对数据的判空处理**，因为不同的电影返回的数据不同，有些信息并不是每部电影数据都是全的。做必要的判空即可，保证逻辑正常不会出错，不必每一项都做判空处理。

一般对二级属性要做一下判空处理，一级属性一般没必要。例如 `casts[index].avatars ? casts[index].avatar.large : ""`，因为`casts[index].avatars`为二级属性，返回的电影数据对象表示为data，那么`data.casts`为一级属性，data对象一般说来不可能为空，所以使用一级属性`data.casts`不会报错。而`data.casts[index].avatars`为二级属性，`data.casts[index].avatar`可能为空，若此二级属性为空，那么`casts[index].avatar.large `就会报错，所以需要对avatar.xxx这样的二级属性做一下存在性的判断，而像data.xxx这样的一级属性没必要做判空处理。

**注意**：(1)图片的缩放裁剪处理。(2)详情页部分电影信息是悬浮在背景图上的，所以对该部分文字绝对定位，使其脱离文档流布局。