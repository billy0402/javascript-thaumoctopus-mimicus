import Hapi from '@hapi/hapi';
import nunjucks from 'nunjucks';

import Application from './lib';
import Controller from './lib/controller';
import HelloController from './helloController';

// 組態 nunjucks，讀取 dist 目錄
nunjucks.configure('./dist', {autoescape: false});

// 使用主機與埠號建立伺服器
const server = new Hapi.server({
    host: 'localhost',
    port: 3000
});

const application = new Application({
    // 回應 http://localhost:3000/
    '/': Controller,
    '/hello/{name*}': HelloController
}, {
    server: server,
    document: function (application, controller, request, reply, body, callback) {
        // 讀取模板並且使用上下文物件進行編譯
        nunjucks.render('./index.html', {body: body}, (err, html) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, html);
        });
    }
});

application.start();
