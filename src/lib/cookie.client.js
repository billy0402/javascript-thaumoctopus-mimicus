import cookie from 'cookies-js';

export default {

    /*
     * name (String): cookies 名稱
     * Returns: cookies 值
     */
    get(name) {
        return cookie.get(name) || undefined;
    },

    /*
     * name (String): cookie 名稱
     * value (String): cookie 值
     * options.secure (Boolean): https 限定
     * options.expires (Number): 逾時時間(毫秒)
     * options.path (String): 限定特定路徑的 cookie
     * options.domain (String): 限定特定網域的 cookie
     * Returns: 未定義
     */
    set(name, value, options = {}) {
        // 針對 cookies-js API，將毫秒轉成秒
        if (options.expires) {
            options.expires /= 1000;
        }
        cookie.set(name, value, options);
    }

};
