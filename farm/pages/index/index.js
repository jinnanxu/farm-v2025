// pages/pet/list.js
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min');
var qqmapsdk;
import utils from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskList: null,
    indexData: {
      schCount: '-',
      taskCount: '-',
      fieldCount: '-',
      cropCount: '-'
    },
    currentLocation: '未知地点'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let isLogin = utils.checkLogin()
    if(!isLogin){
      //进入授权登录页面
      wx.redirectTo({
        url: '/pages/user/login/login',
      })
    }else{
      // this.loadIndexData()
      this.loadTaskList()
      // 用户获取当前地理位置信息
      this.getCurrentPositioning()
      // 获取登录用户信息
      if(wx.getStorageSync('LOGIN_USER')!=''){
        this.initUserInfo()
      }
    }
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
    // this.loadNoteList()
    console.log('app.globalData', app.globalData)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loadIndexData()
    this.setData({taskList: null})
    this.loadTaskList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let tmpTasks = this.data.taskList
    if(tmpTasks==null||tmpTasks.currentpage==tmpTasks.totalpage){
      this.setData({noMore:true})
      return
    }
    tmpTasks.currentpage=tmpTasks.currentpage+1
    this.setData({taskList: tmpTasks})
    this.loadTaskList()
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
  
  //加载农事作业日志列表
  loadTaskList: function(){
    let req = {
      currentpage: 1
    }
    if(this.data.taskList!=null){
        req.totalrecord=this.data.taskList.totalrecord,
        req.currentpage=this.data.taskList.currentpage
    }
    let that = this //先将this赋值给一个局部变量，否则在request的then函数里无法引用
    utils.request(
      app.globalData.apiBaseUrl+'/log/list',
      req,
      'POST'
    ).then(res=>{
      console.log('加载农事作业日志列表', res.data)
      //将响应数据赋值给data
      wx.stopPullDownRefresh()
      let existList = that.data.taskList
      if(existList!=null){
        existList.records.concat(res.data.records)
        that.setData({
          taskList: existList
        })
      }else{
        that.setData({
          taskList: res.data
        })
      }
    })
  },

  //加载仪表盘数据
  loadIndexData: function(){
    let that = this
    let reqParam = {
      lat: app.globalData.locationData.lat,
      lng: app.globalData.locationData.lng
    }
    utils.request(
      app.globalData.apiBaseUrl+'/index/data',
      reqParam,
      'POST'
    ).then(res=>{
      console.log(res.data)
      wx.stopPullDownRefresh()
      that.setData({
        indexData: res.data
      })
    })
  },

  showLargeImage(e) {
    let currIdx = e.currentTarget.dataset.idx
    let logidx = e.currentTarget.dataset.logidx
    let curr = ''
    let imgList = []
    for(var idx=0; idx<this.data.taskList.records[logidx].picList.length; idx++){
        imgList.push(this.data.taskList.records[logidx].picList[idx])
        if(currIdx==idx){
            curr = this.data.taskList.records[logidx].picList[idx]
        }
    }
    wx.previewImage({
        urls: imgList, //需要预览的图片http链接列表，注意是数组
        current: curr, // 当前显示图片的http链接，默认是第一个
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
      
  },

  toAddPage: function(){
    wx.navigateTo({
      url: '/pages/task/publish/log-publish',
    })
  },

  toSchPage: function(){
    wx.navigateTo({
      url: '/pages/schedule/sch-list',
    })
  },

  toTaskPage: function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  // 获取当前定位
  getCurrentPositioning: function() {
    const that = this
    wx.getLocation({
      type: 'wgs84',
      altitude: true,
      isHighAccuracy: true,
      highAccuracyExpireTime: 2000,
      success: function(res) {
        wx.hideLoading()
        console.log(res)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
        app.globalData.locationData={lat: res.latitude, lng: res.longitude} //保存经纬度
        that.loadIndexData() //取到了经纬度后，向后端请求天气预报信息
        
        // 如果有城市名就不通过接口获取了
        let city = app.globalData.currCity
        console.log('当前位置：',city)
        if(city==undefined||city==null||city==''){
          if(wx.getStorageSync('CURR_CITY')==''){
            // 构建请求地址
            // 逆解析接口 /ws/geocoder/v1
            var qqMapApi = 'http://apis.map.qq.com/ws/geocoder/v1/' + "?location=" + that.data.latitude + ',' +
            that.data.longitude + "&key=" + 'NXDBZ-PWQRD-3RK4F-HHB34-C2DPH-KBFBM' + "&get_poi=1";
            that.sendRequest(qqMapApi);
          }else{
            app.globalData.currCity = wx.getStorageSync('CURR_CITY')
            that.setData({currentLocation: app.globalData.currCity})
          }
        }else{
          that.setData({currentLocation: app.globalData.currCity})
          wx.setStorageSync('CURR_CITY', app.globalData.currCity)
        }
      },
      fail: function(res) {
        console.log(res)
        wx.showToast({
          title: '获取位置信息失败',
          icon: 'none'
        })
      }
    })
  },
  sendRequest:function(qqMapApi) {
    const that = this
    wx.request({
      url: qqMapApi,
      header: {
        'Content-Type': 'application/json'
      },
      data: {},
      method:'GET',
      success: (res) => {
        console.log('定位成功：',res)
        if (res.statusCode == 200 && res.data.status == 0) {
          // 从返回值中提取需要的业务地理信息数据 国家、省、市、县区、街道
          // that.setData({ 'address.province': res.data.resul
          let cityStr = res.data.result.address_component.city+res.data.result.address_component.district
          // that.setData({ 'photoService.posLng': res.data.result.location.lat });
          // that.setData({ 'photoService.posLat': res.data.result.location.lng });
          that.setData({
            currentLocation: cityStr
          })
          app.globalData.currCity=cityStr
          wx.setStorage('CURR_CITY', cityStr)
        }
      }
    })
  },

  toDetailPage: function(e){
    let mid = e.currentTarget.dataset.tid
    wx.navigateTo({
      url: '/pages/task/task-detail?mid='+mid,
    })
  },
})