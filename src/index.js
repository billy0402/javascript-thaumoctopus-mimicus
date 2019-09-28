import Hapi from '@hapi/hapi';
import nunjucks from 'nunjucks';

// 組態 nunjucks，讀取 dist 目錄
nunjucks.configure('./dist');

// 使用主機與埠號建立伺服器
const server = new Hapi.server({
    host: 'localhost',
    port: 3000
});

function getName(request) {
    // 預設值
    let name = {
        fname: 'Billy',
        lname: 'Huang'
    };

    // 拆解路徑參數
    let nameParts = request.params.name ? request.params.name.split('/') : [];

    // 優先順序: 路徑參數 > 查訊參數 > 預設值
    name.fname = (nameParts[0] || request.query.fname) || name.fname;
    name.lname = (nameParts[1] || request.query.lname) || name.lname;

    return name;
}

// 增加路由
server.route({
    method: 'GET',
    path: '/hello/{name*}',
    handler: function (request, reply) {
        // 讀取模板並且使用上下文物件進行編譯後，回覆 HTML 回應
        return nunjucks.render('index.html', getName(request));
    }
});

// 啟動伺服器
server.start();
