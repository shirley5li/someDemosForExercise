var cp = require('child_process');
var worker;

// 守护进程作为父进程，创建服务器进程并对其进行监听
function spawn(server, config) {
    // child_process.spawn 使用指定的命令行参数创建新进程。
    // spawn 会返回一个带有stdout和stderr流的对象。
    // 可以通过stdout流来读取子进程返回给Node.js的数据

    // 创建服务器进程
    worker = cp.spawn('node', [server, config]);
    worker.on('exit', function(code) {
        // 如果服务器进程不是正常退出的，则重新创建服务器进程
        if (code !== 0) {
            spawn(server, config);
        }
    });
}
function main(argv) {
    spawn('server.js', argv[0]);
    // 守护进程在接收到SIGTERM信号时终止服务器进程
    process.on('SIGTERM', function() {
        worker.kill();
        process.exit(0);
    });
}
main(process.argv.slice(2));