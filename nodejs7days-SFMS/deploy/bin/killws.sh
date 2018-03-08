# 杀死进程控制脚本
#!/bin/sh
if [ -f "pid"]
then
    kill $(tr -d '\r\n' < pid)
    rm pid
fi