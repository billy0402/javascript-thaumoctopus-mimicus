import Controller from './lib/controller';
import nunjucks from 'nunjucks';

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

function onClick(event) {
    console.log(event.currentTarget);
}

export default class HelloController extends Controller {

    index(application, request, reply, callback) {
        this.context.cookie.set('random', '_' + (Math.floor(Math.random() * 1000) + 1), {path: '/'});
        this.context.data = {random: Math.floor(Math.random() * 1000) + 1};
        callback(null);
    }

    toString(callback) {
        // 這可以透過 Object.assign 做更妥善的處理
        // 但為求簡潔，我們不包括 polyfill 的依賴套件
        let context = getName(this.context);
        context.data = this.context.data;

        // 讀取模板並且使用上下文物件進行編譯
        nunjucks.render('hello.html', context, (err, html) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, html);
        });
    }

    attach(el) {
        console.log(this.context.data.random);
        this.clickHandler = el.addEventListener('click', onClick, false);
    }

    detach(el) {
        el.removeEventListener('click', onClick, false);
    }

}
