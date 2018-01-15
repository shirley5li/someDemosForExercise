// 显示鼠标坐标的函数，用来显示绘制过程中点的坐标，方便查看和调试
// 该函数获取到的是鼠标相对于canvas画布的坐标,并将结果显示到div元素
function getMousePos(event) {
	var e = event || window.event;//为了兼容IE，在IE中，event对象作为window对象的属性存在
	var x = e.clientX;
	var y = e.clientY;
	var putEle = document.getElementById("put");
	var canvasEle = document.getElementById("doraemon");
	// canvas元素在页面上的偏移量
	var left = getElementLeft(canvasEle);
	var top = getElementTop(canvasEle);
	// 将鼠标相对于浏览器窗口的坐标转化为相对于canvas元素的坐标，以方便在画布上取点画图
	putEle.innerHTML = "鼠标相对于canvas的坐标 " + "x:" + (x-left) + " y:" + (y-top);
}

// 获取某个元素相对于页面的左偏移量
function getElementLeft(element) {
	var actualLeft = element.offsetLeft;
	var current = element.offsetParent;
	while(current !== null) {
		actualLeft += current.offsetLeft;
		current = current.offsetParent;
	}
	return actualLeft;
}
// 获取某个元素相对于页面的上偏移量
function getElementTop(element) {
	var actualTop = element.offsetTop;
	var current = element.offsetParent;
	while(current !== null) {
		actualTop += current.offsetTop;
		current = current.offsetParent;
	}
	return actualTop;
}

window.onload = function() {
	// 取得对画布的引用
	var drawing = document.getElementById("doraemon");
	// 确定浏览器支持canvas元素
	if(drawing.getContext) {
		// 获取2D上下文绘图环境
		var context = drawing.getContext("2d");
		// 使用绘制路径方式画我们的机器猫

		// 画头部
		context.beginPath();
		context.lineWidth = 1;// 设置线条宽度
		context.strokeStyle = "#000";//设置描边画笔的颜色
		context.arc(200, 175, 175, 0.7 * Math.PI, 0.3 * Math.PI, false);//绘制弧，中心点（200，175），半径175
		context.fillStyle = "#0bb0da";//设置填充颜色
		context.fill();//填充颜色
		context.stroke();//描边，即绘制路径

		// 画脸部
		context.beginPath();
		context.fillStyle = "#fff";//设置填充颜色，白色
		context.strokeStyle = "#000";
		context.lineWidth = 1;
		context.moveTo(110, 110);//将路径移到点（110，110），不画线,即左下角的点
		context.quadraticCurveTo(-10, 200, 120, 315);//从上一点(110,110)开始绘制一条二次曲线，到(120,315)为止，控制点为(-10,200)
		context.lineTo(280, 315);//添加一个新点(280,315)，并从上一点(120,315)开始绘制一条直线，到(280，315)为止
		context.quadraticCurveTo(410, 210, 290, 110);//画右侧的二阶曲线
		context.lineTo(110, 110);//画上面的横线
		context.fill();
		context.stroke();

		// 画眼圈
		context.beginPath();
		context.fillStyle = "#fff";
		context.strokeStyle = "#000";
		context.lineWidth = 1;
		context.moveTo(110, 110);
		//左眼圈的上半椭圆
		context.bezierCurveTo(110, 25, 200, 25, 200, 100);//创建三次贝塞尔曲线,控制点1(110,25),控制点2(200,25),结束点(200,100)
		context.bezierCurveTo(200, 175, 110, 175, 110, 100);//左眼圈的下半椭圆
		context.moveTo(200, 100);
		context.bezierCurveTo(200, 25, 290, 25, 290, 100);//右眼圈的上半椭圆
		context.bezierCurveTo(290, 175, 200, 175, 200, 100);//右眼圈的下半椭圆
		context.fill();
		context.stroke();

		// 画眼珠
		/*左眼珠*/
		context.beginPath();
		context.fillStyle = "#000";
		context.arc(170, 130, 12, 0, 2 * Math.PI, false);
		context.fill();
		context.stroke();
		/*右眼珠*/
		context.beginPath();
		context.fillStyle = "#000";
		context.arc(230, 130, 12, 0, 2 * Math.PI, false);
		context.fill();
		context.stroke();

		// 画鼻子
		context.beginPath();
		context.fillStyle = "#d05823";
		context.strokeStyle = "#000";
		context.arc(200, 165, 25, 0, 2 * Math.PI, false);
		context.fill();
		context.stroke();

		// 画胡须
		context.beginPath();
		context.strokeStyle = "#000";
		context.lineWidth = 1.5;
		/*左半部分胡须*/
		context.moveTo(80, 175);
		context.lineTo(150, 195);
		context.moveTo(80, 200);
		context.lineTo(150, 205);
		context.moveTo(80, 225);
		context.lineTo(150, 215);
		/*中间部分胡须*/
		context.moveTo(200, 195);
		context.lineTo(200, 280);
		/*右半部分胡须*/
		context.moveTo(320, 175);
		context.lineTo(250, 195);
		context.moveTo(320, 200);
		context.lineTo(250, 205);
		context.moveTo(320, 225);
		context.lineTo(250, 215);
		context.stroke();

		// 画嘴巴
		context.beginPath();
		context.strokeStyle = "#000";
		context.moveTo(80, 240);
		context.quadraticCurveTo(200, 360, 320, 240);
		context.stroke();

		// 画围巾
		context.beginPath();
		context.fillStyle = "#b13209";
		context.strokeStyle = "#000";
		context.moveTo(96, 316);
		context.lineTo(320, 316);
		// context.lineTo(320, 316);
		/*在画布上创建介于两条切线之间的弧，切线交于(330,316)，一个切点为弧线起点(320,316)，一个切点为弧线终点(330,326)*/
		context.arcTo(330, 316, 330, 326, 10);//从上一点(320,316)开始绘制一条曲线，到(330,326)为止。
		context.lineTo(330, 336);
		context.arcTo(330, 346, 320, 346, 10);
		context.lineTo(81, 346);
		context.arcTo(71, 346, 71, 336, 10);
		context.lineTo(71, 326);
		context.arcTo(71, 316, 81, 316, 10);
		context.lineTo(96, 316);
		context.fill();
		context.stroke();

		// 画衣服
		context.beginPath();
		context.fillStyle = "#0bb0da";
		context.strokeStyle = "#000";
		context.moveTo(80, 346);
		context.lineTo(26, 406);
		context.lineTo(65, 440);
        context.lineTo(85, 418);
        context.lineTo(85, 528);
        context.lineTo(185, 528);
        context.lineTo(315, 528);
        context.lineTo(315, 418);
        context.lineTo(337, 440);
        context.lineTo(374, 406);
        context.lineTo(320, 346);
        context.stroke();
        context.fill();

        // 画爪爪
        /*左爪爪*/
        context.beginPath();
        context.fillStyle = "#fff";
		context.strokeStyle = "#000";
		context.arc(37, 433, 30, 0, 2 * Math.PI, false);
		context.fill();
		context.stroke();
		/*右爪爪*/
		context.beginPath();
		context.fillStyle = "#fff";
		context.strokeStyle = "#000";
		context.arc(363, 433, 30, 0, 2 * Math.PI, false);
		context.fill();
		context.stroke();

		// 画肚皮
		context.beginPath();
        context.fillStyle = "#fff";
		context.strokeStyle = "#000";
		context.arc(200, 400, 91, 1.8 * Math.PI, 1.2 * Math.PI, false);
		context.fill();
		context.stroke();

		// 画口袋
		context.beginPath();
		context.fillStyle = "#fff";
		context.strokeStyle = "#000";
		context.moveTo(130, 394);
		context.lineTo(270, 394);
		context.moveTo(130, 394);
		context.bezierCurveTo(130, 490, 270, 490, 270, 394);
		context.fill();
		context.stroke();

		// 画脚丫子
		/*左脚丫*/
		context.beginPath();
		context.fillStyle = "#fff";
		context.strokeStyle = "#000";
		context.moveTo(180,528);
        context.lineTo(72,528);
        context.bezierCurveTo(52,528,52,558,72,558);
        context.lineTo(180,558);
        context.bezierCurveTo(200,558,200,528,180,528);
        context.fill();
        context.stroke();
        /*右脚丫*/
        context.beginPath();
		context.fillStyle = "#fff";
		context.strokeStyle = "#000";
		context.moveTo(220,528);
        context.lineTo(328,528);
        context.bezierCurveTo(348,528,348,558,328,558);
        context.lineTo(220,558);
        context.bezierCurveTo(200,558,200,528,220,528);
        context.fill();
        context.stroke();

        // 画尾巴
        context.beginPath();
		context.fillStyle = "#fff";
		context.strokeStyle = "#000";
		context.arc(200, 529, 20, Math.PI, false);
		context.fill();
        context.stroke();

        // 画铃铛
        context.beginPath();
		context.fillStyle = "#FFFF00";
		context.strokeStyle = "#000";
		context.arc(200, 359, 18, 2 * Math.PI, false);
		context.fill();
        context.stroke();




	}
	

};