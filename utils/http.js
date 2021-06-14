import {
    config
} from "../config/config";
import {
    promisic
} from "./util";
import {
    Token
} from "../models/token";
import {
    codes
} from "../config/exception-config";
import {
    HttpException
} from "../core/http-exception";

class Http {
    /**
     * 老版本的小程序因不支持promise，因此需要用promise封装wx.request接口来同步获取到返回数据；
     * 新版本中小程序已支持promise，所以可以不必再用promise封装wx.request接口，直接在wx.request前面加上
     * await即可同步获取到服务端数据。如：const data = await wx.request({...})
     */
    static async request({
        url,
        data,
        method = 'GET',
        refetch = true,
        throwError = false
    }) {
        let res
        try {
            res = await promisic(wx.request)({
                url: `${config.apiBaseUrl}${url}`,
                data,
                method,
                header: {
                    'content-type': 'application/json',
                    appkey: config.appkey, //若是调用自己的api,则可以去掉appkey
                    'authorization': `Bearer ${wx.getStorageSync('token')}`
                }
            })
        } catch (e) {
            // 无网络，进入catch块
            if (throwError) {
                throw new HttpException(-1, codes[-1])
            }
            Http.showError(-1)
            return null
        }
        const code = res.statusCode.toString()
        // 判断http状态码首位是否为2，是的话代表请求成功，直接返回数据
        if (code.startsWith('2')) {
            return res.data
        } else {
            // 401代表token失效，需再次获取新token并重发请求
            if (code === '401') {
                // 二次重发(data.refetch标示位防止多次二次重发)
                if (data.refetch) {
                    Http._refetch({
                        url,
                        data,
                        method
                    })
                }
            } else {
                if (throwError) {
                    throw new HttpException(res.data.code, res.data.message, code)
                }
                if (code === '404') {
                    if (res.data.code !== undefined) {
                        return null
                    }
                    return res.data
                }
                const error_code = res.data.code;
                Http.showError(error_code, res.data)
            }
        }
        return res.data
    }

    static async _refetch(data) {
        const token = new Token()
        await token.getTokenFromServer()
        data.refetch = false
        return await Http.request(data)
    }

    static showError(error_code, serverError) {
        let tip

        if (!error_code) {
            tip = codes[9999]
        } else {
            if (codes[error_code] === undefined) {
                tip = serverError.message
            } else {
                tip = codes[error_code]
            }
        }

        wx.showToast({
            icon: "none",
            title: tip,
            duration: 3000
        })
    }
}

export {
    Http
}