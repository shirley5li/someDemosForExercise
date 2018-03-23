window.onload = function() {
    var images = document.getElementsByTagName('img'); //获取图片元素对象，包括指针和奖品图片对象
    var pionter = images[0];
    var turntable = images[1];
    var displayInfo = document.getElementById('displayInfo'); //显示中奖信息

    var angle = 51.4; //共七个扇区，平均每个51.4度
    var stayAngle = 0; //转圈结束后，指针停留所在扇区的度数
    var offOn = true;  //是否正在抽奖，true表示没有正在旋转即转盘处于关闭状态

    pointer.onclick = function() {
        if (offOn) { //如果转盘处于关闭状态则开启
            // turntable.style.transform = 'rotate(0deg)';
            offOn = !offOn; //旋转开启后置为false
            rotating(); //转盘开始旋转
        }
    };

    // 奖品图片旋转
    function rotating() {
        var timer = null; //定时器
        var random = 0; //随机度数
        clearInterval(timer);

        timer = setTimeout(function() {
                random = Math.floor((Math.random() * (1 - 0.2 + 1) + 0.2) * 3600); //生成(0.2-1) * 3600度之间的随机数
                // 开始利用CSS3 的transform特性旋转
                turntable.style.transform = 'rotate(' + random + 'deg)';
                clearInterval(timer); //停止定时器

                // 等4秒钟后旋转停止，显示中奖信息
                setTimeout(function() {
                    offOn = !offOn; //将转盘旋转置于关闭状态
                    stayAngle = random % 360;

                    if (stayAngle <= angle * 1) {
                        displayInfo.innerHTML = '恭喜您获得 4999元代金券';
                    } else if (stayAngle <= angle * 2) {
                        displayInfo.innerHTML = '恭喜您获得 50元代金券';
                    } else if (stayAngle <= angle * 3) {
                        displayInfo.innerHTML = '恭喜您获得 10元代金券';
                    } else if (stayAngle <= angle * 4) {
                        displayInfo.innerHTML = '恭喜您获得 5元代金券';
                    } else if (stayAngle <= angle * 5) {
                        displayInfo.innerHTML = '恭喜您获得 免分期服务费特权';
                    } else if ( stayAngle <= angle * 6) {
                        displayInfo.innerHTML = '恭喜您获得 提高白条额度特权';
                    } else if (stayAngle <= angle * 7) {
                        displayInfo.innerHTML = 'opps,下次一定会中奖嗒！';
                    }
                }, 4000);
        }, 30);
    }
};