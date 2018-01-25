鼠标拖放参考自博客[HTML5--拖拽API](http://blog.csdn.net/baidu_25343343/article/details/53215193)。

1、拖放的基本思想：创建一个绝对定位的元素，使其可以用鼠标拖动。

2、与鼠标拖放相关的事件(**拖动事件**)：

**被拖动的源对象可以触发的事件：**

(1)ondragstart：源对象开始被拖动

(2)ondrag：源对象被拖动过程中(鼠标可能在移动也可能未移动)

(3)ondragend：源对象被拖动结束

**拖动源对象进入到目标对象可以触发的事件：**

(1)ondragenter：目标对象被源对象拖动着进入

(2)ondragover：目标对象被源对象拖动着悬停在上方

(3)ondragleave：源对象拖动着离开了目标对象

(4)ondrop：源对象拖动着在目标对象上方释放/松手

3、在拖动的源对象事件和目标对象事件间**传递数据**
 
HTML5为所有的拖动相关事件提供了一个新的属性： `e.dataTransfer { }` //数据传递对象

功能：用于在源对象和目标对象的事件间传递数据

源对象上的事件处理中保存数据：`e.dataTransfer.setData( k,  v );`  //k,v必须都是string类型

目标对象上的事件处理中读取数据： `var v = e.dataTransfer.getData( k );`

4、几个事件属性的说明

参考自[博客](https://www.cnblogs.com/deerfig/p/6432683.html)。
`event.clientX` 事件属性返回当事件被触发时鼠标指针相对于浏览器可视区（当前窗口）的水平坐标，不包括工具栏和滚动条。

`event.pageX` 类似于event.clientX、event.clientY，但它们使用的是文档坐标而非窗口坐标。

`event.offsetX` 鼠标指针位置相对于触发事件的对象的 x 坐标。

**5、模拟垃圾桶删除文件效果**

效果：模拟电脑中 ”垃圾桶“的效果， 总共显示三个小飞机，拖动着某个小飞机到垃圾桶上方后，小飞机从DOM树上删除

注意：从DOM子节点中删除元素，需要阻止ondragover的默认行为(ondragover有一个默认行为，即当ondragover触发时，ondrop会失效)。利用源对象和目标对象之间的数据传递对象记录小飞机的ID。

如何阻止ondragover的默认行为？

	element.ondragover = function(event) { // 源对象在悬停在目标对象上时
		event.preventDefault(); // 阻止默认行为，使得drop可以触发
	};
	element.ondroo = function(event) { // 将源对象松手释放在了目标对象中
		
	};
**遇到的问题：**按照拖放的基本思想，创建一个绝对定位的元素，使其可以用鼠标拖动，于是最开始我将plane1、plane2、plane3绝对定位了，但是拖动元素删除的时候却发现，拖动plane1的时候会带动plane3一起移动到目标节点位置(即垃圾桶的位置)，但是只会删除plane1，类似的拖动plane2也会带动plane3一起移动。但神奇的是，当逆序移动删除时，即先移动删除plane3时，却不会影响另外两个。后面将plane1、plane2、plane3的绝对定位取消，就不会有影响了。还没搞清楚为什么元素绝对定位后，拖动前面的元素会影响最后一个定位元素，连带最后一个定位元素一起移动。
