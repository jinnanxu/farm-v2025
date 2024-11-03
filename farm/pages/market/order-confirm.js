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
      that.loadmarketInfo()
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

  //加载市场信息详情
  loadmarketInfo: function(){
    let that = this
    let req = {
      mid: that.data.mid
    }
    utils.request(
      app.globalData.apiBaseUrl+'/market/detail',
      req,
      'POST'
    ).then(res=>{
      wx.stopPullDownRefresh()
      that.setData({
        marketInfo: res.data
      })
      //填充意向订单基本信息
      let sellerId = ''
      let buyerId = ''
      if(res.data.infoType==1){
        //出售
        sellerId=res.data.userId
        buyerId=that.data.userInfo.userId
      }else{
        //求购
        buyerId=res.data.userId
        sellerId=that.data.userInfo.userId
      }
      that.setData({
        'intentionOrder.marketInfoId':res.data.marketInfoId,
        'intentionOrder.sellerId': sellerId,
        'intentionOrder.buyerId': buyerId,
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
    let that = this
    setTimeout(() => {
      if(appInfo.userId==that.data.marketInfo.userId){
        wx.showModal({
          title: '提示',
          content: '不能向自己提交意向订单！',
          complete: (res) => {
            wx.navigateBack()
          }
        })
      }
    }, 800);
  },

  bindDateChange: function(e) {
    this.setData({'intentionOrder.expDate': e.detail.value, today: e.detail.value})
  },

  bindPriceInput: function(e){
    if(this.data.marketInfo.infoType==1){
      //出售
      this.setData({ 'intentionOrder.buyerPrice': e.detail.value })
    }else{
      //求购
      this.setData({ 'intentionOrder.sellerPrice': e.detail.value })
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
    var req = this.data.intentionOrder
    wx.request({
      url: app.globalData.apiBaseUrl+'/market/order/save',
      header: {
        'content-type': 'application/json' ,
        'Authorization': wx.getStorageSync('TOKEN')
      },
      data: req,
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
})