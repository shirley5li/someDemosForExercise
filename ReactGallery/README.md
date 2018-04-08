使用了React、webpack构建一个画廊。

# 1、脚手架准备 #

## 在本地安装yeoman(先装有node.js环境) ##

参考[Yeoman安装和使用详解](https://www.cnblogs.com/weixing/p/6305837.html)。

[前端项目可以更简单—Yeoman入门指南（1）](http://ju.outofmemory.cn/entry/36120)

[Yeoman官方教程：用Yeoman和AngularJS做Web应用](http://blog.jobbole.com/65399/)

Yeoman主要提供了三个工具：脚手架（yo），构建工具（grunt），包管理器（bower）。这三个工具是分别独立开发的，但是需要配合使用，来实现我们更高效的工作流模式。

安装步骤：(1)`npm install -g yo grunt-cli bower`

## 安装generator `react-webpack` ##

generator-前缀的模块表明它是一种工程模版，比如你的web工程是基于bootstrap框架，那么可以安装generator-bootstrap，使用yo来自动生成该目录（会带上bootstrap的源码)。

此处我们安装了`react-webpack`生成器。

方法1：`yo`命令 --> 用上下键选择install a generator -->在`? Search npm for generators:`中输入要安装的生成器`react-webpack`,然后选中即可

**注意！！**此处比较坑爹的就是，不知为何，使用以上问答的方式安装生成器`react-webpack`时，在输入要安装的生成器名字后，返回404错误。莫名其妙，于是换了以下方法。

方法2：使用命令`npm install -g generator-react-webpack`。

天，又出错！！！错误提示`npm ERR! Unexpected end of JSON input while parsing near '...-alpha.0911da3","depe'`。好像是因为npm缓存的原因，估计是前面几次执行安装命令不成功的后遗症吧，于是使用`npm cache clean --force`先清一下缓存，再次使用`npm install -g generator-react-webpack`安装`react-webpack`生成器。

不过npm提示说，这个包现在已经没人维护了，毕竟两年前的[	YEOMAN生成器项目](http://yeoman.io/generators/)了，又一次感受到了前端技术就像是妹子买新衣服，变得太快了，而且YEOMAN社区看着也已经苟延残喘了，大部分generator包都是两年前的。不过虽然它过时了，大致的思路应该存在的。还是学习一下，毕竟工程化的思维现在的我还是很欠缺的。

## 生成工程目录 ##
### 利用github创建本地的YEOMAN工作目录 ###
在这里我将该项目放在了已经被git管理的根目录E:\someDemosForExercise下(someDemosForExercise已经放在github上了)，项目名字取为ReactGallery。

打开工程根目录，此处即为git bash到 E:\someDemosForExercise\ReactGallery，运行命令`yo webpack-react`,然后选择一些y/n，即可在项目根目录下生成一些项目的基本管理文件。

**1？遇到的问题，待解决：运行命令`yo webpack-react`后，ReactGallery下缺少Gruntfile.js文件，还有Bower也没配置。后面有时间再来补充吧。**

**[Windows下安装Grunt的指南和相关说明](http://www.bluesdream.com/blog/windows-installs-the-grunt-and-instructions.html)**

解答：没有Gruntfile.js不是安装错误，而是generator-react-webpack V2.0 移除了Grunt（webpack替代）。可以执行 npm start 或者npm run serve 启动服务。

**2？未解决**

运行命令`yo webpack-react`后，提示 PhantomJS not found on PATH，不知道什么毛病。

然后运行`node server`可以在locallhost:8000端口，查看项目的效果。


# 2、YEOMAN、bower、grunt安装过程注意点 #

本前端工程化解决方案主要包括：YEOMAN、bower、grunt。

其中grunt属于构建工具。grunt依赖于node.js环境。

YEOMAN 为webapp的脚手架。

bower为webapp的包管理器，web站点由框架、库、公共部分组成，bower则用来跟踪管理这些。

grunt 属于构建工具，用于项目自动化，减少像压缩、编译、单元测试、代码校验这种重复且无业务关联的工作。**[Windows下安装Grunt的指南和相关说明](http://www.bluesdream.com/blog/windows-installs-the-grunt-and-instructions.html)**

## YEOMAN ##
要使用YEOMAN生成需要的项目脚手架，需要安装YEOMAN的生成器。

例如项目想要做一个基于angular的应用，需要先安装以下生成器， `npm install -g generator-angular`。然后，再创建一个项目目录，进入该项目目录，执行 `yo angular pro_name`创建一个angular项目，其中pro_name表示创建的angular项目名字。

接下来会询问需要使用sass么，注意，sass需要ruby环境。

**注意：**package.json中，dependencies表示生产环境中依赖的包，例如我们是发布的一个npm包，那么别人引入这个npm包时也会一并下载dependencies中的包，devDependencies表示开发环境中依赖的包。

# 3、待学习...... #

前端项目的工程化还是有点复杂，由于现阶段，更想从基础学习React，复杂的工程化操作对我这个对React还很陌生的小白而言，可能对React的本质学习帮助没有那么大，待自己打好React基础，深入理解之后，再来完善学习工程化的方法。