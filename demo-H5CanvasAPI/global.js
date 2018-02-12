/* 检测浏览器对canvas支持情况 */
try {
	document.createElement("canvas").getContext("2d");
	document.getElementById("support").innerHTML = "HTML5 Canvas is supported in your browser.";
} catch (e) {
	document.getElementById("support").innerHTML = "HTML5 Canvas is not supported in your browser, please update your browser.";
}

/* 定义树冠轮廓 ，将此轮廓绘制在(0,0)左上角*/
function defineCanopyPath(context) {
	//绘制树冠
	context.beginPath();
	context.moveTo(-25, -50);
	context.lineTo(-10, -80);
	context.lineTo(-20, -80);
	context.lineTo(-5, -110);
	context.lineTo(-15, -110);
	//树冠的顶点
	context.lineTo(0, -140);
	context.lineTo(15, -110);
	context.lineTo(5, -110);
	context.lineTo(20, -80);
	context.lineTo(10, -80);
	context.lineTo(25, -50);
	//连接起点，闭合路径
	context.closePath();
}

//创建小路对象绘制函数
function drawTrails(context, img) {
	//绘制小路
	context.save();//保存当前canvas的context状态
	context.translate(-10, 350);//变换坐标系
	context.beginPath();
	context.moveTo(0, 0);//将坐标恢复到修正层的原点
	context.quadraticCurveTo(170, -50, 260, -190); 
	context.quadraticCurveTo(310, -250, 410, -250);
	context.lineWidth = 20;
	// context.strokeStyle = '#663300';
	/*使用树干纹理背景图片,以背景图平铺的方式绘制小路*/
	context.strokeStyle = context.createPattern(img, 'repeat');
	context.stroke();
	context.restore();//恢复之前的canvas状态	
}

//创建树对象绘制函数
function drawTree(context) {
	//绘制树的阴影
	context.save();
	context.rotate(0.6);
	context.scale(1, 0.8);//y轴方向，将阴影的高度压缩为原来的60%
	context.fillStyle = 'rgba(0, 0, 0, 0.2)';//使用透明度为0.2的黑色填充树干
	context.fillRect(-5, -50, 10, 50);
	defineCanopyPath(context);//使用已有的阴影效果绘制树冠
	context.fill();
	context.restore();

	//定义树冠轮廓
	defineCanopyPath(context);
	context.lineWidth = 4;
	context.lineJoin = 'round';
	context.strokeStyle = '#663300';
	context.stroke();//绘制定义的树冠轮廓
	context.fillStyle = '#339900';
	context.fill();// 填充闭合树冠

	// 用纯色填充作为树干的矩形
	/*context.fillStyle = '#663300';
	context.fillRect(-5, -50, 10, 50);
	context.restore();*/

	//用背景图案填充作为树干的矩形
	/*context.save();
	context.translate(130, 250);
	context.drawImage(img, -5, -50, 10, 50);
	context.restore();*/

	// 使用渐变色填充用作树干纹理
	var trunkGradient = context.createLinearGradient(-5, -50, 5, -50);//创建三阶水平渐变对象
	trunkGradient.addColorStop(0, '#663300');//树干左侧边缘的颜色为一般程度的棕色
	trunkGradient.addColorStop(0.4, '#996600');//树干中间偏左的位置颜色淡一些
	trunkGradient.addColorStop(1, '#552200');//树干右侧边缘颜色深一些
	context.fillStyle = trunkGradient;//使用水平渐变色填充树干
	context.fillRect(-5, -50, 10, 50);
	/*创建垂直渐变，用作树冠在树干上的投影*/
	var canopyShadow = context.createLinearGradient(0, -50, 0, 0);
	canopyShadow.addColorStop(0, 'rgba(0, 0, 0, 0.8)');//投影渐变的起点是透明度为0.5的黑色
	canopyShadow.addColorStop(0.4, 'rgba(0, 0, 0, 0.0)');//渐变方向垂直向下，渐变色在很短距离内迅速渐变至完全透明
	context.fillStyle = canopyShadow;//使用投影渐变填充树干
	context.fillRect(-5, -50, 10, 50);
}

//创建文本对象绘制函数
function drawText(context, img) {
	context.save();
	// 为文字设置阴影效果
	context.shadowColor = 'rgba(0, 0, 0, 0.5)';
	context.shadowOffsetX = 15;
	context.shadowOffsetY = -10;
	context.shadowBlur = 2;
	context.font = '60px impact';
	// context.fillStyle = '#996600';
	context.fillStyle = context.createPattern(img, 'repeat');// 使用树干纹理图片作为文字的填充背景
	context.textAlign = 'center';
	context.fillText('Happy New Year!', 200, 60, 400);
	context.restore();
}

//创建用于绘制完整logo的函数
function drawLogo(img) {
		var canvas = document.getElementById('track');
		var context = canvas.getContext('2d');

		// 在(130,250)处绘制第一棵树
		context.save();//保存尚未修改的context
		context.translate(130, 250);//将路径绘制在canvas之前，先经过变换,将当前位置变换到新位置
		drawTree(context);//绘制树对象
		context.restore();

		// 在(260,500)处绘制第二棵较大的树
		context.save();
		context.translate(260, 500);
		context.scale(2, 2);//将第二棵树的宽高分别放大至原来的2倍
		drawTree(context);
		context.restore();

		// 绘制小路对象
		drawTrails(context, img);

		// 绘制文本对象
		drawText(context, img);
}


/*** 画热点图***/
//加载热点图
function loadHeatmap() {
	points = {};
	SCALE = 3;
	x = -1;
	y = -1;
	document.getElementById("resetBtn").onclick = reset;//点击重置按钮，清空画布
	canvasH = document.getElementById("heatmap");
	contextH = canvasH.getContext("2d");
	contextH.globalAlpha = 0.2;//为canvas设置一个高透明值
	contextH.globalCompositeOperation = 'lighter';//设置为混合模式，显示源图像 + 目标图像

	//根据鼠标移动，将鼠标的位置保存
	canvasH.onmousemove = function(e) {
		x = e.clientX - e.target.offsetLeft;
		y = e.clientY - e.target.offsetTop + 400;
		addToPoint(x, y);
	};
}
//热点图重置函数
function reset() {
	points = {};//清空保存的鼠标位置记录点
	contextH.clearRect(0, 0, 300, 300);
	x = -1;
	y = -1;
}
//颜色查找表，intensity越大，返回的颜色越亮
function getColor(intensity) {
	var colors = ['#072933', '#2E4045', '#8C593B', '#82814E', '#FAC268', '#FAD237'];//颜色亮度由低到高
	return colors[Math.floor(intensity / 2)];
}
//鼠标停留在canvas区域，在鼠标悬停位置绘制点，停留时间越久，绘制的点越大越亮
function drawPoint(x, y, radius) {
	contextH.fillStyle = getColor(radius);//获取的颜色亮度与绘制点的半径成正比，半径越大，颜色越亮
	radius = Math.sqrt(radius) * 6;
	contextH.beginPath();
	contextH.arc(x, y, radius, 0, Math.PI * 2, true);
	contextH.closePath();
	contextH.fill();
}
//鼠标移动或悬停时调用，用于记录给定象素点的当前热度值及位置
function addToPoint(x, y) {
	x = Math.floor(x / SCALE);
	y = Math.floor(y / SCALE);
	if(!points[[x, y]]) { // points[[x, y]]用于记录点[x,y]的热度值，最高为10
		points[[x, y]] = 1;
	} else if (points[[x, y]] == 10) {
		return;
	} else {
		points[[x, y]] ++;
	}
	drawPoint(x * SCALE, y * SCALE, points[[x, y]]);
}

window.onload = function() {
	// 加载树干纹理图片
	var trunk = new Image();
	trunk.src = "images/trunk.jpg";
	// 树干纹理图片加载完毕再对canvas进行操作
	trunk.onload = function() {
		drawLogo(trunk);
		loadHeatmap();
	};	
};