const promisic = function (func) {
    return function (params = {}) {
        return new Promise((resolve, reject) => {
            const args = Object.assign(params, {
                success: (res) => {
                    resolve(res);
                },
                fail: (error) => {
                    reject(error);
                }
            });
            /**
             * 此处相当于调用微信请求接口wx.request({...})，Promise对象在创建时会执行
             * Promise构造函数参数传进来的函数，该参数函数有resolve（必填）和reject（可选）
             * 两个参数，若该参数函数内执行的异步函数执行成功了，调用resolve()函数设置结果值，
             * 即可通过返回的Promise对象获取到所设置的结果值
             */
            func(args);
        });
    };
};

const combination = function (arr, size) {
    var r = [];

    function _(t, a, n) {
        if (n === 0) {
            r[r.length] = t;
            return;
        }
        for (var i = 0, l = a.length - n; i <= l; i++) {
            var b = t.slice();
            b.push(a[i]);
            _(b, a.slice(i + 1), n - 1);
        }
    }
    _([], arr, size);
    return r;
}

export {
    promisic,
    combination
}