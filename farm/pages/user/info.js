// pages/user/info.js
var app = getApp()
import utils from '../../utils/util.js'
import Dialog from '@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    profileImg: null,
    userInfo: {},
    farmInfo: {},
    user: {
      "mobile": "",
      "pwd": "",
      "userId": "",
      "pic": "",
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initUserInfo()
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
    if(app.globalData.imgSrc!=null&&app.globalData.imgSrc!=''){
      //显示已裁剪的头像
      this.setData({profileImg: app.globalData.imgSrc, 'user.pic':app.globalData.imgSrc})
    }
  },

  //选择图片
  chooseImg: function(){
    let _this = this
    wx.chooseMedia({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      mediaType: ['image'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const picUrl = res.tempFiles[0].tempFilePath
        wx.navigateTo({
          url: '/pages/copper/cropper?picurl='+picUrl,
        })
      }
    })
  },

  initUserInfo(){
    if(app.globalData.userInfo == null){
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/user/login/login',
            })
          }
        }
      })
    }else{
      let appInfo = app.globalData.userInfo
      console.log(appInfo)
      this.setData({
        userInfo : appInfo,
        profileImg: appInfo.pic,
        user: appInfo,
        'farmInfo.farmId': appInfo.farmId
      })
    }
  },

  bindNickNameChange: function(e){
    this.setData({ 'user.nickName': e.detail.value})
  },

  bindMobileChange: function (e) {
    this.setData({ 'user.mobile': e.detail.value })
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

  //提交表单
  publishUpdate: function(e){
    wx.showLoading({
      title: '正在更新',
    })
    let that = this
    let req = { userInfo: this.data.user, farmInfo: {} }
    if(this.data.user.role==1){
      //农场主
    }
    utils.request(
      app.globalData.apiBaseUrl+'/user/update',
      req
    ).then(res=>{
      wx.hideLoading()
      Dialog.alert({
        title: '提示',
        message: '个人信息已更新',
      }).then(() => {
        console.log(res)
        console.log('更新用户成功：设置全局变量', app.globalData.userInfo)
        app.globalData.userInfo = res.data.userInfo
        that.setData({
          userInfo: res.data
        })
        wx.setStorageSync('LOGIN_USER', res.data.userInfo)
        console.log('更新用户成功：获取全局变量', app.globalData.userInfo)
        wx.switchTab({
          url: '/pages/user/profile',
        })
      });
    })
    app.globalData.imgSrc=''
  },

  //刷新用户信息
  reloadUser: function(){
    var that = this
    wx.request({
      url: app.globalData.apiBaseUrl+'/user/updateUser',
      header: {
        'content-type': 'application/json' ,
        'Cookie': wx.getStorageSync('cookieKey')
      },
      method: 'POST',
      success(res){
        console.log(res)
        wx.hideLoading()
        if(res.data.code == "0"){
        }
      }
    })
  },
          
})