#!/bin/bash
# 构建用于部署的静态版本
echo "正在构建用于部署的版本..."

# 创建dist目录
rm -rf dist
mkdir -p dist

# 复制所有必要的文件到dist目录
cp index.html styles.css script.js plan_config.json README.md USAGE_GUIDE.md PLAN_INFO.md DEPLOY_GUIDE.md package.json dist/

echo "构建完成！文件已保存到 dist/ 目录中"
echo "您可以将 dist/ 目录中的文件上传到任意静态网站托管服务"