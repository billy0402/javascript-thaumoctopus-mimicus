import Hapi from 'hapi';
import nunjucks from 'nunjucks';
import path from 'path';

// 使用主機與埠號建立伺服器
const server = new Hapi.Server({
    debug: {
        request: ['error']
    }
});
server.connection({
    host: 'localhost',
    port: 3000
});

const APP_FILE_PATH = '/application.js';
server.route({
    method: 'GET',
    path: APP_FILE_PATH,
    handler: (request, reply) => {
        reply.file('dist/build/application.js');
    }
});

server.route({
    method: 'GET',
    path: '/templates/{template*}',
    handler: {
        file: (request) => {
            return path.join('dist', request.params.template);
        }
    }
});

export default {
    nunjucks: './dist',
    server: server,
    document: function (application, controller, request, reply, body, callback) {
        // 讀取模板並且使用上下文物件進行編譯
        nunjucks.render('./index.html', {
            body: body,
            application: APP_FILE_PATH
        }, (err, html) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, html);
        });
    }
};
