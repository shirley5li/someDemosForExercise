window.onload = function() {
	//为源对象添加事件监听，记录拖动了哪一个源对象 
	var srcList = document.querySelectorAll(".source"); //找到全部要被拖动的img元素  
	// 遍历img元素
	for(var i = 0; i < srcList.length; i++) {
		var plane = srcList[i];
		//开始拖动源对象
		plane.ondragstart = function(event) {
			//保存源对象的数据，即该img元素的id
			event.dataTransfer.setData("planeID", this.id);
			// 记录一开始拖动时，鼠标指针相对于触发事件的对象plane的偏移量
			offsetX = event.offsetX;
			offsetY = event.offsetY;
		};
		// 源对象在拖动过程中
		plane.ondrag = function(event) {
			// 记录拖动过程中，鼠标指针的位置相对于文档的坐标
			var pageX = event.pageX;
			var pageY = event.pageY;
			// drag事件最后一刻，无法读取鼠标的坐标，pageX和pageY都变为0 
			if(pageX==0 && pageY==0){  
            	return; //不处理拖动最后一刻 pageX和 pageY都变为0 的情形  
        	}
        	// 拖动过程中图片的位置改变，x、y为图片左上角距离页面左上角的距离
        	x = pageX - offsetX;
       	 	y = pageY - offsetY;
        	plane.style.left = x + "px";
        	plane.style.top = y + "px";
		};
		// 源对象结束拖动
		plane.ondragend = function(event) {
			// 将图片定位在最后松鼠标的位置
			plane.style.left = x + "px";
        	plane.style.top = y + "px";
		};

	}

	//为目标对象添加事件监听，需要删除拖动到目标对象上的源对象
	var trash = document.getElementById("trash");
	// 源对象进入目标对象 
	trash.ondragenter = function(event) {
		console.log("drag enter");
		trash.style.opacity = 1;
	};
	// 源对象在悬停在目标对象上时
	trash.ondragover = function(event) {
		event.preventDefault(); //阻止默认行为，使得drop可以触发
	};
	//源对象离开目标对象后  
	trash.ondragleave = function(event) {
		console.log("drag leave");
		trash.style.opacity = 0.2;
	};
	//源对象松手释放在了目标对象中
	trash.ondrop = function(event) {
		console.log("drop");
		trash.style.opacity = 0.2;
		//删除被拖动的源对象
		var id = event.dataTransfer.getData("planeID"); // 得到源对象的数据，即源对象id
		var plane = document.getElementById(id); //获取到对应id值的DOM元素节点
		// 从父元素中删除子节点
		plane.parentNode.removeChild(plane);
	};
};