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

export default class HelloController extends Controller {

    toString(callback) {
        // 讀取模板並且使用上下文物件進行編譯
        nunjucks.renderString('<p>Hello, {{fname}} {{lname}}!</p>', getName(this.context), (err, html) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, html);
        });
    }

}
