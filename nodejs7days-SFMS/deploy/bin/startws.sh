# 启动服务控制脚本
#!/bin/sh
if [! -f "pid"]
then
    node ../lib/daemmon.js ../conf/config.json &
    echo $! > pid
fi