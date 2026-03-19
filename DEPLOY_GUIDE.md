# 部署指南

您可以将公考计划跟踪器部署到各种静态网站托管服务，这样无论在电脑还是手机上都能访问。

## 方案一：使用GitHub Pages（免费）

### 1. 准备工作
- 注册一个GitHub账户
- 安装Git

### 2. 创建GitHub仓库
1. 在GitHub上创建一个新的仓库，例如：`gongkao-tracker`
2. 记住仓库地址，类似：`https://github.com/你的用户名/gongkao-tracker.git`

### 3. 部署到GitHub Pages
1. 将本地项目文件上传到GitHub仓库：
   ```bash
   cd /Users/fengsuizhou/gongkao_tracker
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/你的用户名/gongkao-tracker.git
   git branch -M main
   git push -u origin main
   ```

2. 在GitHub仓库设置中启用Pages：
   - 进入仓库的Settings
   - 找到Pages选项
   - 选择Source为"Deploy from a branch"
   - 选择分支main，文件夹/docs或/ (root)
   - 保存设置

3. 几分钟后，您可以通过 `https://你的用户名.github.io/gongkao-tracker` 访问应用

## 方案二：使用Netlify（免费）

1. 访问 https://www.netlify.com/
2. 点击"Sign up"注册账户
3. 登录后点击"Add new site"
4. 选择"Drag and drop your site here"或使用GitHub集成
5. 上传整个gongkao_tracker文件夹中的文件（index.html, styles.css, script.js, plan_config.json等）
6. 配置部署设置后点击Deploy
7. Netlify会为您提供一个唯一的URL，您可以用手机访问

## 方案三：使用Vercel（免费）

1. 访问 https://vercel.com/
2. 注册并登录
3. 点击"New Project"
4. 选择"Upload a folder"并上传gongkao_tracker文件夹中的文件
5. 点击Deploy
6. 您将获得一个唯一的访问URL

## 方案四：临时共享（仅限同网络）

如果您只需要临时共享，也可以：
1. 确保手机和电脑在同一WiFi网络
2. 运行本地服务器：`node server.js`
3. 使用服务器提供的IP地址（如http://192.168.x.x:3000）访问

## 注意事项

- 一旦部署到云端，您的学习进度将存储在您设备的浏览器中
- 不同设备间的进度不会同步（除非您扩展应用以支持云存储）
- 访问部署的网址即可使用应用，无需安装任何软件