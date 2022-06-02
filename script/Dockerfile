# 设置基础镜像,如果本地没有该镜像，会从Docker.io服务器pull镜像
FROM harbor.maip.io/test/nodejs:14.0.0

# 配置环境变量
ENV NODE_ENV production

# 这个是容器中的文件目录
RUN mkdir -p /usr/src/app 

# 设置工作目录
WORKDIR /usr/src/app

# 拷贝package.json文件到工作目录
# !!重要：package.json需要单独添加。
# Docker在构建镜像的时候，是一层一层构建的，仅当这一层有变化时，重新构建对应的层。
# 如果package.json和源代码一起添加到镜像，则每次修改源码都需要重新安装npm模块，这样木有必要。
# 所以，正确的顺序是: 添加package.json；安装npm模块；添加源代码。
COPY package.json /usr/src/app/package.json

# 删除包文件
RUN rm -rf node_modules
# 安装npm依赖(使用淘宝的镜像源)
# 如果使用的境外服务器，无需使用淘宝的镜像源，即改为`RUN npm i`。
RUN npm i --production

# 拷贝所有源代码到工作目
COPY . /usr/src/app

# 编译typescript文件,放在这里会增加体积没必要,放在ci里
# (坑)https://www.eggjs.org/zh-CN/tutorials/typescript#%E9%83%A8%E7%BD%B2deploy
RUN npm run tsc

# 暴露容器端口
EXPOSE 9000

CMD npm start