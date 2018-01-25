window.onload = function() {
	//监听document的dragover事件，取消其默认行为,使得drop事件可以触发
	document.ondragover = function(event) {
		event.preventDefault();
	};
	// 监听drop事件，并阻止默认行为，即阻止在新窗口中打开图片
	document.ondrop = function(event) {
		event.preventDefault();
	};
	// 监听div#displayImg的drop事件，设法读取到释放的图片数据，显示出来
	var displayImg = document.getElementById("displayImg");
	displayImg.ondragover = function(event) {
		event.preventDefault();
	};
	displayImg.ondrop = function(event) {
		console.log("客户端拖动着一张图片释放了。。。");
		//找到拖放的文件对象, file0是读取到的文件对象列表中的第一个文件对象 File
		var file0 = event.dataTransfer.files[0];
		//创建文件读取器
		var fileReader = new FileReader();
		// 从文件中读取文本字符串
		// fileReader.readAsText(file0);

		// 从文件中读取URL数据
		fileReader.readAsDataURL(file0);
		// 读取完成
		fileReader.onload = function() {
			console.log("读取文件完成");
			console.log(fileReader.result);
			// 创建img标签并设置url属性，添加到DOM树中
			var img = new Image();
			// 将img元素的src属性值设置为读取到的URL数据
			img.src = fileReader.result;
			// 将img元素添加到DOM树
			displayImg.appendChild(img);
		};
	};
};
