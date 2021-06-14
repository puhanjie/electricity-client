import {
    config
} from "../config/config";
import {
    promisic
} from "../utils/util";

class Token {
    // 1. 携带Token
    // server 请求Token
    // 登录 token -> storage
    // token 1. token不存在 2.token 过期时间
    // 静默登录

    constructor() {
        this.tokenUrl = config.apiBaseUrl + "token"
        this.verifyUrl = config.apiBaseUrl + "token/verify"
    }

    // 验证token是否存在和有效
    async verify() {
        const token = wx.getStorageSync('token')
        if (!token) {
            // token不存在，则去服务器获取token
            await this.getTokenFromServer()
        } else {
            // token存在，则验证token是否还有效
            await this._verifyFromServer(token)
        }
    }

    async getTokenFromServer() {
        /**
         * 此处已执行登陆操作获取token
         * （和[我的]页面中的登陆按钮获取用户信息是两回事，获取token才是真正的登陆）
         */
        const r = await wx.login()
        const code = r.code

        const res = await promisic(wx.request)({
            url: this.tokenUrl,
            method: 'POST',
            data: {
                account: code,
                type: 0
            },
        })
        wx.setStorageSync('token', res.data.token)
        return res.data.token
    }

    async _verifyFromServer(token) {
        const res = await promisic(wx.request)({
            url: this.verifyUrl,
            method: 'POST',
            data: {
                token
            }
        })

        const valid = res.data.is_valid
        if (!valid) {
            // token失效，再次向服务器获取新token
            return this.getTokenFromServer()
        }
    }
}

export {
    Token
}