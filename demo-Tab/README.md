# Javascript Tab/选项卡实现

选项卡，也称页签，英文用Tab(Module-Tabs)表示。Tab将不同的内容重叠放在一个布局块内，重叠的内容区里每次只有其中一个是可见的。
Tab可以在相同的空间里展示更多的信息，它把相似的主题分为一类，用户更好理解。
Tab的应用可以缩短页面屏长，降低信息的显示密度，同时又不牺牲信息量。
### Tab特点 ###
1、每个页签由标题区和内容区组成
2、内容区和标题一一对应
3、至少有两组页签以便可以切换
4、所有页签只有两种状态：选中和未选中，页面载入后默认显示第一个
5、选中页签(当前页签)只有一个并突出高亮显示
6、鼠标点击或移上时切换
标准的Tab标题设计时放在顶部，也有很多放在左侧的。
![携程Tab示例图片](https://images0.cnblogs.com/blog/114013/201411/131102419916932.png)
### Tab的内容载入方式 ###
通常有三种方式：
1、html片段: 这种方式最常见，tab内容在页面打开后就载入了，缺点是页面内容较多，非第一帧内容也加载了，导致页面打开较慢
2、iframe请求: 很多广告采用这种方式，可以加快页面载入，缺点是切换后不能立即展示
3、Ajax请求: 通过异步请求拼接tab内容，优缺点同iframe
### Tab实现 ###
Tab的实现简单，只要HTML结构合理，JS给标题添加click或mouseover事件然后切换显示。这里采用HTML属性配置的方式，主要通过3-5个属性实现。

    data-ui="u-tab" ：Tab的外层包裹元素
    data-ui="tab-nav"：Tab的所有标题元素
    data-ui="tab-content"：Tab的所有内容元素
    data-ui="tab-arror"：Tab切换时的动画元素
    data-iframe="http://xxx.jd.com/a.htm"：内容为iframe的Tab元素
还可以使用jQuery插件的方式实现。
参考博客[JavaScript选项卡/页签/Tab的实现](https://www.cnblogs.com/snandy/p/4093984.html)。
[javascript实现tab切换的四种方法](http://www.jb51.net/article/74395.htm)
[JavaScript实现Tab标签页切换的最简便方式](https://www.cnblogs.com/-867259206/p/5664896.html)

本实现参考了第三篇博客的方式四，使用原生Javascript来实现四个Tab标签的鼠标滑过切换。
**【实现中遇到的问题】**
1、忽略了span元素是行内元素，不能设置宽高，因此在布局时纠结了好久，span元素都填不满父元素，导致四周有丑陋的间隙。将span元素设置为inline-block。
2、一开始将脚本放在了head部分，结果`var tabs = document.getElementById("tabNav").getElementsByTagName("span");`总是提示`getElementsByTagName`无法读取"null"的属性，一开始还以为DOM获取操作语法写错了，但检查了很久没发现错误，后面突然意识到，脚本放在head部分会阻塞DOM解析，因此脚本在执行时识别不到DOM元素。随后就给script添加了defer属性，但问题还是存在。最终将脚本放在body后面就可以了。

[demo on codePen](https://codepen.io/shirley5li/full/aqxVJz)
