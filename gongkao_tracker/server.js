// 简单的静态文件服务器，用于运行公考计划跟踪器应用
const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '0.0.0.0'; // 改为监听所有网络接口
const port = 3000;

const server = http.createServer((req, res) => {
    // 默认请求页面
    let filePath = req.url === '/' ? './index.html' : `.${req.url}`;

    // 确定文件内容类型
    const extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        default:
            contentType = 'text/html';
    }

    // 读取文件
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // 文件未找到
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                // 其他错误
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            // 成功读取文件
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(port, hostname, () => {
    console.log(`公考计划跟踪器应用运行在 http://${getLocalIP()}:${port}/`);
    console.log('按 Ctrl+C 停止服务器');
});

// 获取本地IP地址的函数
function getLocalIP() {
    const os = require('os');
    const interfaces = os.networkInterfaces();

    for (const interfaceName in interfaces) {
        const interface = interfaces[interfaceName];
        for (const iface of interface) {
            if (!iface.internal && iface.family === 'IPv4') {
                return iface.address;
            }
        }
    }

    return '127.0.0.1';
}