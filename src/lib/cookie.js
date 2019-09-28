export default function (request, reply) {

    // 編碼函式 https://www.rfc-editor.org/rfc/rfc6265.txt
    function cleanName(name) {
        name = name.replace(/[^#$&+\^`|]/g, encodeURIComponent);
        return name.replace(/\(/g, '%28').replace(/\)/g, '%29');
    }

    function cleanValue(value) {
        return (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);
    }

    return {

        get(name) {
            return request.state[name] && decodeURIComponent(request.state[name]) ||
                undefined;
        },

        set(name, value, options = {}) {
            reply.state(cleanName(name), cleanValue(value), {
                // 如果值為假，使用 hapi 的預設值
                isSecure: options.secure || false,
                path: options.path || null,
                ttl: options.expires || null,
                domain: options.domain || null
            });
        }

    };

}
