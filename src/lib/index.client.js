import Call from 'call';
import queryString from 'query-string';
import cookie from './cookie.client';
import replyFactory from './reply.client';

export default class Application {

    constructor(routes, options) {
        // 將路由儲存為控制器的查詢表
        this.routes = routes;
        this.options = options;
        // 建構 call 路由器實例
        this.router = new Call.Router();
        this.registerRoutes(routes);
    }

    registerRoutes(routes) {
        // 遍歷路由，並將它們添加為 call 路由器的實例
        for (let path in routes) {
            this.router.add({
                method: 'get',
                path: path
            });
        }
    }

    createController(url) {
        // 分析路徑與搜尋字串
        let urlParts = url.split('?');
        // 將 URL 的不同部分析解成陣列
        let [path, search] = urlParts;
        // 看看 URL 路徑是否匹配路由器當中的路由
        let match = this.router.route('get', path);
        // 分析路由的路徑與參數
        let {route, params} = match;
        // 在路由表查詢 Controller 類別
        let Controller = this.routes[route];

        return Controller ?
            // 建構控制器實例
            new Controller({
                // 將 search 字串剖析成物件
                query: queryString.parse(search),
                params: params,
                cookie: cookie
            }) : undefined;
    }

    // 封裝在 rehydrate 方法中被使用的程式碼
    // 以及 start 方法中的 popStateListener
    getUrl() {
        let {pathname, search} = window.location;
        return `${pathname}${search}`;
    }

    rehydrate() {
        let targetEl = document.querySelector(this.options.target);

        this.controller = this.createController(this.getUrl());
        this.controller.deserialize();
        this.controller.attach(targetEl);
    }

    navigate(url, push = true) {
        // 如果瀏覽器不支援 History API
        if (!history.pushState) {
            // 就設定 location，並返回
            window.location = url;
            return undefined;
        }

        let previousController = this.controller;
        this.controller = this.createController(url);

        // 如果控制器被建立，就處理導覽
        if (this.controller) {
            // request 與 reply 存根
            const request = () => {
            };
            const reply = replyFactory(this);

            // 僅於 push 屬性為真時
            if (push) {
                // 推入 history 堆疊
                history.pushState({}, null, url);
            }

            // 執行控制器動作
            this.controller.index(this, request, reply, (err) => {
                if (err) {
                    return reply(err);
                }

                let targetEl = document.querySelector(this.options.target);
                if (previousController) {
                    previousController.detach(targetEl);
                }

                // 渲染控制器回應
                this.controller.render(this.options.target, (err, response) => {
                    if (err) {
                        return reply(err);
                    }

                    reply(response);
                    this.controller.attach(targetEl);
                });
            });
        }
    }

    start() {
        // 建立事件監聽器
        this.popStateListener = window.addEventListener('popstate', (event) => {
            let url = this.getUrl();
            console.log(url);
            this.navigate(url, false);
        });

        // 建立點擊監聽器
        // 如果滿足執行標準
        this.clickListener = document.addEventListener('click', (event) => {
            let {target} = event;
            let identifier = target.dataset.navigate;
            let href = target.getAttribute('href');

            if (identifier !== undefined) {
                // 如果使用者點擊 href，就阻止
                if (href) {
                    // 預設的瀏覽器動作 (加載新的 HTML 文件)
                    event.preventDefault();
                }

                // 如果有定義的話，navigate 使用 identifier，否則使用 href
                this.navigate(identifier || href);
            }
        });

        this.rehydrate();
    }

}
