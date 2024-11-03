// miniprogram/pages/login/login.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '18912341234',
    pwd: '123456',
    showAuth: false
  },

  onLoad: function(options){
   //弹出登录授权框
    this.setData({showAuth: true})
  },

  //向服务端发起请求，获取openid，关联到数据库用户表的记录，如果没有则创建新用户
  userLogin(){
    let that = this
    wx.showLoading({
      title: '正在在加载',
    })
    wx.login({
      success (res) {
        if (res.code) {
          console.log(res)
          //发起网络请求
          wx.request({
            url: app.globalData.apiBaseUrl+'/user/getopenid',
            method: 'GET',
            data: {
              code: res.code
            },
            success(res){
              wx.hideLoading()
              //回调函数
              console.log("得到openid响应:",res)
              if(res.data.data.user.status==0){
                //未激活的用户
                app.globalData.activeOpenid=res.data.data.openid
                app.globalData.userInfo=res.data.data.user
                wx.showModal({
                  title: '提示',
                  content: '您的账号尚未注册，请先完善个人信息。',
                  showCancel: false,
                  complete: (res) => {
                    if (res.confirm) {
                      wx.redirectTo({
                        url: '/pages/user/active',
                      })
                    }
                  }
                })
              }else if(res.data.data.user.status==-1){
                //用户被管理员冻结了
                wx.showModal({
                  title: '提示',
                  content: '您的账号已被冻结，请联系管理员。',
                  showCancel: false,
                  complete: (res) => {}
                })
                app.globalData.activeOpenid=''
                app.globalData.userInfo=null
              }else{
                //授权登录成功
                if(res.data.code=="0"){
                  wx.setStorageSync("TOKEN", res.data.data.token)
                  app.globalData.userInfo=res.data.data.user
                  //data: res.data.data.openid
                  wx.setStorageSync("LOGIN_USER", res.data.data.user)
                  wx.setStorageSync('CURR_USER_ROLE', res.data.data.user.role)
                  let currTime = (new Date()).getTime()
                  wx.setStorageSync('LAST_LOGIN_TIME', currTime)
                  let tabUrl = '/pages/index/index'
                  wx.switchTab({
                    url: tabUrl,
                  })
                }
              }
            },
            fail(res){
              console.log("获取openid失败，重试！")
              wx.hideLoading()
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
        that.setData({showAuth: false})
      }
    })
  },

  onCloseAuth: function(){
    this.setData({showAuth: false})
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  inputMobile: function(e){
    this.setData({ mobile: e.detail.value })
  },

  inputPwd: function (e) {
    this.setData({ pwd: e.detail.value })
  },
  
  toValidate: function(e){
    wx.navigateTo({
      url: '/pages/user/profile'
    })
  },



})