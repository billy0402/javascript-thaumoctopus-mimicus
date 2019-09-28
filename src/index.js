import nunjucks from 'nunjucks';

import Application from './lib';
import Controller from './lib/controller';
import HelloController from './helloController';
import options from './options';

// 組態 nunjucks，讀取 dist 目錄
nunjucks.configure(options.nunjucks, {autoescape: false});

const application = new Application({
    // 回應 http://localhost:3000/
    '/': Controller,
    '/hello/{name*}': HelloController
}, options);

application.start();
