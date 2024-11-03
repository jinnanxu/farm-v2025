var app = getApp()
import utils from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    newMsg: 0,
    notLogin: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let isLogin = utils.checkLogin()
    if(!isLogin){
      //进入授权登录页面
      wx.redirectTo({
        url: '/pages/user/login/login',
      })
    }
    if(wx.getStorageSync('LOGIN_USER')!=''){
      this.initUserInfo()
    }
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  toLogin: function(){
    wx.navigateTo({
      url: '/pages/user/login/login',
    })
  },

  toMyFields: function() {
    wx.navigateTo({
      url: '/pages/fields/list?category=field',
    })
  },
  
  toMyCrop: function() {
    wx.navigateTo({
      url: '/pages/fields/list?category=crop',
    })
  },

  toPlant: function() {
    wx.navigateTo({
      url: '/pages/fields/plant/plant-mgr',
    })
  },

  toModifyProfile: function(){
    wx.navigateTo({
      url: '/pages/user/info',
    })
  },
  
  logout: function(){
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success(res){
        if(res.confirm){
          wx.removeStorage({
            key: 'TOKEN'
          })
          wx.removeStorage({
            key: 'LOGIN_USER'
          })
          wx.removeStorage({
            key: 'LAST_LOGIN_TIME'
          })
          wx.switchTab({
            url: '/pages/market/market-info',
          })
        }
      }
    })
  }
})