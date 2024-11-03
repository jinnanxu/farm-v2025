// pages/user/active.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    nickName: '',
    city: '',
    detailAdd: '',
    inputForm: false,
    userInfo: null,
    farmList: [],
    sindex: 0,
    openid: '',
    farm: {
      farmName: '',
      farmDesc: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let appUserInfo = app.globalData.userInfo
    let openId = app.globalData.activeOpenid
    this.setData({userInfo: appUserInfo, openid: openId})
    this.loadPostStation()
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

  },

  onInputMobile: function(e){
    this.setData({ 'userInfo.mobile': e.detail.value })
  },

  onInputNickName: function(e){
    this.setData({ 'userInfo.nickName': e.detail.value })
  },
  
  onInputFarmName: function(e){
    this.setData({ 
      'farm.farmName': e.detail.value,
      'userInfo.farmName': e.detail.value,
     })
  },

  onInputFarmDesc: function(e){
    this.setData({ 'farm.farmDesc': e.detail.value })
  },

  onInputTel: function(e){
    this.setData({ 'station.tel': e.detail.value })
  },

  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },

  bindOpenTime: function(e) {
    this.setData({
      openTime: e.detail.value
    })
  },

  bindCloseTime: function(e) {
    this.setData({
      closeTime: e.detail.value
    })
  },

  bindStationChange: function(e) {
    let idx = e.detail.value
    this.setData({
      sindex: idx,
      'userInfo.farmName': this.data.farmList[idx].farmName, 
      'userInfo.farmId': this.data.farmList[idx].farmId
    })
  },

  loadPostStation: function(){
    let that = this
    let req = this.data
    wx.request({
      url: app.globalData.apiBaseUrl+'/user/farm/list',
      method: 'POST',
      data: req,
      success(res){
        that.setData({farmList: res.data.data, 'userInfo.farmName': res.data.data[0].farmName, 'userInfo.farmId': res.data.data[0].farmId})
      }
    })
  },

  //激活事件
  submitForm: function(){
    let req = this.data
    wx.request({
      url: app.globalData.apiBaseUrl+'/user/active',
      method: 'POST',
      data: req,
      success(res){
        wx.hideLoading()
        //回调函数
        console.log("激活用户响应:",res)
        if(res.data.code!="0"){
          //激活失败
          wx.showModal({
            title: '提示',
            content: '激活失败',
            showCancel: false,
            complete: (res) => {}
          })
        }else{
          //激活成功
          wx.setStorageSync("TOKEN", res.data.data.token)
          //data: res.data.data.openid
          wx.setStorageSync("LOGIN_USER", res.data.data.user)
          app.globalData.userInfo=res.data.data.user
          let currTime = (new Date()).getTime()
          wx.setStorageSync('LAST_LOGIN_TIME', currTime)
          wx.setStorageSync('CURR_USER_ROLE', res.data.data.user.role)
          wx.showModal({
            title: '提示',
            content: '账号已激活绑定',
            showCancel: false,
            complete: (res) => {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/index/index',
                })
              }
            }
          })
        }
      },
      fail(res){
        console.log("激活失败，重试！",res)
        wx.hideLoading()
      }
    })
  },

  /**
   * 激活农场主表单
   */
  activeFarmer: function(){
    this.setData({
      inputForm: true,
      'userInfo.role': 1,
      'userInfo.status': 1,
      'userInfo.userId': this.data.userInfo.userId
    })
  },

  /**
   * 激活采购员
   */
  activePurchaser: function(){
    this.setData({
      inputForm: true,
      'userInfo.role': 2,
      'userInfo.status': 1,
      'userInfo.userId': this.data.userInfo.userId
    })
  },
})