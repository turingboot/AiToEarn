# Railway rustfs:以 root 运行,解决 Railway 卷(root 属主)权限问题
# 复用官方镜像的 /entrypoint.sh 与默认 CMD(rustfs),仅切换用户为 root
FROM rustfs/rustfs:latest
USER root
