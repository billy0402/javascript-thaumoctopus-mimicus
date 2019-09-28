import nunjucks from 'nunjucks';

import Application from './lib';
import HomeController from './homeController';
import HelloController from './helloController';
import options from './options';

// 組態 nunjucks，讀取 dist 目錄
nunjucks.configure(options.nunjucks, {autoescape: false});

const application = new Application({
    // 回應 http://localhost:3000/
    '/': HomeController,
    '/hello/{name*}': HelloController
}, options);

application.start();
