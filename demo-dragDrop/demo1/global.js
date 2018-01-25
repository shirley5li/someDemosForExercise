window.onload = function() {
	var plane = document.getElementById("plane");
	var position = document.getElementById("position");
	// 开始拖动图片
	plane.ondragstart = function(event){
		console.log("事件源plane开始拖动");
		// 记录一开始拖动时，鼠标指针相对于触发事件的对象plane的偏移量
		offsetX = event.offsetX;
		offsetY = event.offsetY;
		position.innerHTML = "鼠标指针相对于plane的偏移量offsetX:" + offsetX + "</br>" + "鼠标指针相对于plane的偏移量offsetY:" + offsetY;
	};
	// 图片拖动过程中
	plane.ondrag = function(event) {
		console.log("事件源plane在拖动过程中");
		// 记录拖动过程中，鼠标指针的位置相对于文档的坐标
		var pageX = event.pageX;
		var pageY = event.pageY;
		console.log("pageX: " + pageX + " pageY: " + pageY);
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
	// 图片拖动结束
	plane.ondragend = function(event) {
		console.log("事件源plane拖动结束");
		// 将图片定位在最后松鼠标的位置
		plane.style.left = x + "px";
        plane.style.top = y + "px";
	};

};