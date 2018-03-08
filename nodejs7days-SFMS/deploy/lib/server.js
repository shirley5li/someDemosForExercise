var fs = require('fs'),
    path = require('path'),
    http = require('http');

var MIME = {
    '.css': 'text/css',
    '.js': 'application/javascript'
};

/* 合并文件 */

// 合并文件使用了异步API读取文件，避免服务器因等待磁盘IO而发生阻塞
function combineFiles(pathnames, callback) {
    var output = [];

    // 异步方式遍历存放请求文件路径的数组
    (function next(i, len) {
        if (i < len) {
            fs.readFile(pathnames[i], function(err, data) {
                if (err) {
                    callback(err);
                } else {
                    output.push(data);
                    next(i + 1, len);
                }
            });
        } else {
            callback(null, Buffer.concat(output));
        }
    } (0, pathnames.length));
}

/* 服务器入口函数 */

// 使用命令行参数传递JSON配置文件路径，入口函数负责读取配置并创建服务器。
function main(argv) {
    // 使用fs.readFileSync从源路径(命令行参数argv[0])读取文件内容
    var config = JSON.parse(fs.readFileSync(argv[0], 'utf-8')),
        root = config.root || '.',
        port = config.port || 80,
        server;

    //服务器根据请求路径做出响应
    server = http.createServer(function(request, response) {
        var urlInfo = parseURL(root, request.url);//request.url不包含协议头和域名

        // 检查文件是否存在，若有效则立即输出响应头，并接着一边按顺序读取文件一边输出响应内容
        validateFiles(urlInfo.pathnames, function(err, pathnames) {
            if (err) {
                response.writeHead(404);
                response.end(err.message);
            } else {
                response.writeHead(200, {
                    'Content-Type': urlInfo.mime
                });
                outputFiles(pathnames, response);
            }
        });

        // //第一次迭代
        // combineFiles(urlInfo.pathnames, function(err, data) {
        //     if (err) {
        //         response.writeHead(404);
        //         response.end(err.message);
        //     } else {
        //         response.writeHead(200, {
        //             'Content-Type': urlInfo.mime
        //         });
        //         response.end(data);
        //     }
        // });
    }).listen(port);
    // 服务器进程这一端，同样在收到SIGTERM信号时先停掉HTTP服务再正常退出
    process.on('SIGTERM', function() {
        server.close(function() {
            process.exit(0);
        });
    });
}

/* 根据客户端的http请求url（不包含协议头和域名），解析请求的文件路径 */

// http://assets.example.com/foo/??bar.js,baz.js 中url为 /foo/??bar.js,baz.js
// http://assets.example.com/foo/bar.js 中url为/foo/bar.js
function parseURL(root, url) {
    var base,
        pathnames,
        parts;
    // 若为普通URL,将普通URL转换为了文件合并URL,使得两种URL的处理方式可以一致
    if (url.indexOf("??" === -1)) {
        url = url.replace('/', '/??');//当路径中不含"??"时，使用 "/??"替换第一个匹配到的 "/"
    }
    parts = url.split("??");
    base = parts[0];
    pathnames = parts[1].split(',').map(function(value) {
        return path.join(root, base, value);
    });

    return {
        // path.extname用于提取文件的扩展名  path.extname('foo/bar.js'); 返回".js"
        mime: MIME[path.extname(pathnames[0])] || 'text/plain',
        pathnames: pathnames
    };
}

/* 检查文件是否存在 */
function validateFiles(pathnames, callback) {
    (function next(i, len) {
        if (i < len) {
            // fs.stat读取文件状态，以检查文件是否存在
            fs.stat(pathnames[i], function(err,status) {
                if (err) {
                    callback(err);
                } else if (!status.isFile()){
                    callback(new Error());
                } else {
                    next(i + 1, len);
                }
            });
        } else {
            callback(null, pathnames);
        }
    } (0, pathnames.length));
}

/* 输出文件 */
function outputFiles(pathnames, writer) {
    (function next(i, len) {
        if (i < len) {
            var reader = fs.createReadStream(pathnames[i]);
            // 用pipe方法把两个数据流连接起来
            reader.pipe(writer, {end: false});
            reader.on('end', function() {
                next(i + 1, len);
            });
        } else {
            writer.end();
        }
    } (0, pathnames.length));
}



// process是一个全局变量，可通过process.argv获得命令行参数。
// 由于argv[0]固定等于NodeJS执行程序的绝对路径，argv[1]固定等于主模块的绝对路径，
// 因此第一个命令行参数从argv[2]这个位置开始。
main(process.argv.slice(2));

process.on('SIGTERM', function() {
    server.close(function() {
        process.exit(0);
    });
});