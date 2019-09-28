import Hapi from '@hapi/hapi';

// 使用主機與埠號建立伺服器
const server = new Hapi.server({
    host: 'localhost',
    port: 3000
});

// 增加路由
server.route({
    method: 'GET',
    path: '/hello',
    handler: function (request, reply) {
        return 'Hello World!';
    }
});

// 啟動伺服器
server.start();
