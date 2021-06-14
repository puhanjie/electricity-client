const config = {
    //appkey是调用第三方(慕课网)api的凭证。获取方式:访问https://talelin.com/#course，课程服务->获取appkey
    appkey: 'xjIimEZQaZrg2scM',
    /**
     * 调用该第三方api地址时，在需要用到身份认证的接口的时候，会认证失败，服务器返回401。把该地址换成自己本地的
     * api地址则不会出现身份认证问题，因为token认证时，需要绑定小程序appid，每个开发者appid不一样。
     */
    apiBaseUrl: 'http://se.talelin.com/v1/'
}

export {
    config
}