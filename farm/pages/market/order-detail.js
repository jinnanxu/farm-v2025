// pages/market/order-confirm.js
const app = getApp()
import utils from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    marketInfo: {},
    userInfo : null,
    notLogin: false,
    intentionOrder:{
      sellerId: '',
      buyerId: '',
      marketInfoId: '',
      quantity: '',
      expDate: '',
      buyerPrice: '',
      sellerPrice: '',
      status: 1
    },
    newBuyerPrice: '',
    newSellerPrice: '',
    today: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    this.setData({
      mid: options.mid
    }, ()=>{
      that.loadOrderDetail()
    })
    let today = new Date()
    let todayStr = utils.formatDate(today)
    this.setData({today: todayStr, 'intentionOrder.expDate': todayStr})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let isLogin = utils.checkLogin()
    if(!isLogin){
      //进入授权登录页面
      wx.redirectTo({
        url: '/pages/user/login/login',
      })
    }else{
      this.initUserInfo()
    }
  },

  //加载订单信息详情
  loadOrderDetail: function(){
    let that = this
    let req = {
      mid: that.data.mid
    }
    utils.request(
      app.globalData.apiBaseUrl+'/market/order/detail',
      req,
      'POST'
    ).then(res=>{
      wx.stopPullDownRefresh()
      that.setData({
        intentionOrder: res.data
      })
    })
  },

  //加载当前登录用户的信息
  initUserInfo: function(){
    let appInfo = wx.getStorageSync('LOGIN_USER')
    if(appInfo!=null){
      app.globalData.userInfo=appInfo
    }
    console.log(appInfo)
    this.setData({
      userInfo : appInfo,
      notLogin: false
    })
  },

  bindDateChange: function(e) {
    this.setData({'intentionOrder.expDate': e.detail.value, today: e.detail.value})
  },

  bindPriceInput: function(e){
    if(this.data.intentionOrder.marketInfo.userId==this.data.userInfo.userId){
      //这个市场供需是当前登录用户发布的
      if(this.data.intentionOrder.marketInfo.infoType==1){
        //发布的是出售类市场资讯，因此当前登录用户是卖家
        this.setData({ newSellerPrice: e.detail.value })
      }else{
        //当前登录用户是买家
        this.setData({ newBuyerPrice: e.detail.value })
      }
    }else{
      //这个市场供需不是当前登录用户发布的
      if(this.data.intentionOrder.marketInfo.infoType==1){
        //发布的是出售类市场资讯，因此当前登录用户是买家
        this.setData({ newBuyerPrice: e.detail.value })
      }else{
        //当前登录用户是卖家
        this.setData({ newSellerPrice: e.detail.value })
      }
    }
  },
  bindQuntityInput: function(e){
    this.setData({ 'intentionOrder.quantity': e.detail.value })
  },

  /**
   * 提交表单
   */
  publishLog: function(){
    wx.showLoading({
      title: '加载中',
    })
    let newForm = this.data.intentionOrder
    // var req = this.data.intentionOrder
    if(this.data.newSellerPrice!=''){
      newForm.sellerPrice = this.data.newSellerPrice
    }
    if(this.data.newBuyerPrice!=''){
      newForm.buyerPrice = this.data.newBuyerPrice
    }
    wx.request({
      url: app.globalData.apiBaseUrl+'/market/order/update',
      header: {
        'content-type': 'application/json' ,
        'Authorization': wx.getStorageSync('TOKEN')
      },
      data: newForm,
      method: 'POST',
      success(res){
        console.log(res)
        wx.hideLoading()
        if(res.data.code == "0"){
          wx.showModal({
            title: '提示',
            content: '提交成功，请留意意向单状态变化。',
            showCancel: false,
            success (res2) {
              if (res2.confirm) {
                wx.switchTab({
                  url: '/pages/market/market-info',
                })
              }
            }
          })
        }else{
          wx.showToast({
            title: '系统繁忙，发布失败！',
            icon: 'error'
          })
        }
      }
    })
  },

  confirmOrder: function(){
    let that = this
    wx.showModal({
      title: '提示',
      content: '确认要按对方出价确认意向订单吗？',
      complete: (res) => {
        if (res.cancel) {
          
        }
        if (res.confirm) {
          that.submitConfirmOrder()
        }
      }
    })
  },

  submitConfirmOrder: function(){
    //确定最终谈拢的价格
    let finalPrice = 0
    if(this.data.intentionOrder.marketInfo.userId==this.data.userInfo.userId){
      //这个市场供需是当前登录用户发布的
      if(this.data.intentionOrder.marketInfo.infoType==1){
        //发布的是出售类市场资讯，因此当前登录用户是卖家，若当前用户确认意向，则以对方报价为准，若对方未报价，不能提交确认请求
        finalPrice = this.data.intentionOrder.buyerPrice
      }else{
        //当前登录用户是买家
        finalPrice = this.data.intentionOrder.sellerPrice
      }
    }else{
      //这个市场供需不是当前登录用户发布的
      if(this.data.intentionOrder.marketInfo.infoType==1){
        //发布的是出售类市场资讯，因此当前登录用户是买家，，若当前用户确认意向，则以对方即卖方报价为准
        finalPrice = this.data.intentionOrder.sellerPrice
      }else{
        //当前登录用户是卖家
        finalPrice = this.data.intentionOrder.buyerPrice
      }
    }
    if(finalPrice == '' || finalPrice == 0){
      //对方未报价，不能提交
      wx.showModal({
        title: '提示',
        content: '请等待对方报价后方能确认意向',
        showCancel: false,
        complete: (res) => {

        }
      })
    }else{
      wx.showLoading({
        title: '加载中',
      })
      let newForm = {
        orderId: this.data.intentionOrder.orderId,
        finalPrice: finalPrice
      }
      wx.request({
        url: app.globalData.apiBaseUrl+'/market/order/confirm',
        header: {
          'content-type': 'application/json' ,
          'Authorization': wx.getStorageSync('TOKEN')
        },
        data: newForm,
        method: 'POST',
        success(res){
          wx.hideLoading()
          console.log(res)
          wx.showModal({
            title: '提示',
            content: '已确认意向订单，请按意向单的价格与时间履行交易，诚信经营！',
            showCancel: false,
            complete: (res) => {
              wx.navigateBack()
            }
          })
        }
      })
    }
  }
})