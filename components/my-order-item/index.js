import {
    OrderDetail
} from "../../models/order-detail";
import {
    Payment
} from "../../models/payment";

Component({
    /**
     * 组件的属性列表
     */
    externalClasses: ['l-class'],
    properties: {
        item: Object,
    },

    /**
     * 组件的初始数据
     */
    data: {
        _item: Object
    },


    observers: {
        'item, currentStatus': function (item) {
            if (!item) {
                return
            }
            const order = new OrderDetail(item)
            this.setData({
                _item: order
            })
        }
    },

    attached() {
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onGotoDetail(event) {
            const oid = this.data._item.id
            wx.navigateTo({
                url: `/pages/order-detail/order-detail?oid=${oid}`
            })
        },
        onCountdownEnd(event) {
            this.data._item.correctOrderStatus()
            this.setData({
                _item: this.data._item
            })
        },

        async onPay(event) {
            const oid = this.data._item.id;

            if (!oid) {
                this.enableSubmitBtn()
                return
            }
            wx.lin.showLoading({
                type: "flash",
                fullScreen: true,
                color: "#157658"
            })
            const payParams = await Payment.getPayParams(oid)
            let res
            try {
                res = await wx.requestPayment(payParams)
                wx.lin.hideLoading()
                this.triggerEvent('paysuccess', {
                    oid
                })
            } catch (e) {
                console.error(e)
                wx.lin.hideLoading()
            }
        }
    }
})