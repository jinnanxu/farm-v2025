// pages/publish/publish.js
var app = getApp()
import utils from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadImgs: [],
    operaterList: ["巡园","灌水","幼苗移裁","施肥","用药","修剪","除草","松土平整","采收","清园","补苗","其他"],
    periodList:["幼苗期","旺长期","现蕾至开花期","幼果期","果实膨大生长期","成熟采收期","采收结束期","其它作业"],
    selectedOperatIndex: 0,
    selectedPeriodIndex: 0,
    selectedFieldindex: 0,
    logWeather: false,
    fieldList: [],
    fieldIndex: 0,
    currField: null,
    weather: {},
    task: {
      field: '',
      crop: '',
      period: '幼树期',
      taskType: '巡园',
      taskDetail: '',
      pics: '',
      temp: '',
      weather: ''
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadFieldList()
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
    }else{
      this.loadCurrWeather()
    }
  },

  loadFieldList: function(){
    let that = this
    utils.request(
      app.globalData.apiBaseUrl+'/field/list',
      {},
      'POST'
    ).then(res=>{
        console.log(res.data)
        that.setData({
          fieldList: res.data.records
        })
      }
    )
  },
  
  //查询当前天气情况 
  loadCurrWeather: function(){
    let that = this
    utils.request(
      app.globalData.apiBaseUrl+'/log/get/weather',
      {},
      'POST'
    ).then(res=>{
        console.log(res.data)
        that.setData({
          weather: res.data,
          'task.temp': res.data.temp,
          'task.weather': res.data.weather,
        })
      }
    )
  },

  //选择图片
  chooseImg: function(){
    let _this = this
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        console.log(res)
        wx.showLoading({
          title: '上传图片中...',
        })
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        for(var idx=0; idx<tempFilePaths.length; idx++){
          var tmpFileName = tempFilePaths[0].substring(tempFilePaths[idx].lastIndexOf('/')+1)
          wx.uploadFile({
            url: 'http://129.211.222.131:16602/upload-server/upload', //图片服务器
            filePath: tempFilePaths[idx],
            name: 'myFile',
            formData: {
              'user': 'test',
              'fileName': tmpFileName,
              'u': app.globalData.uid
            },
            success (res){
              //上传成功回调
              wx.hideLoading()
              let resjson = JSON.parse(res.data)
              console.log(resjson.url)
              let picArr = _this.data.uploadImgs
              picArr.push(resjson.url)
              _this.setData({
                uploadImgs: picArr
              })
            }
          })
        }
      }
    })
  },

  bindFieldRemarkInput: function(e){
    this.setData({ 'task.taskDetail': e.detail.value })
  },
  bindWorkInput: function(e){
    this.setData({ workContent: e.detail.value })
  },
  checkboxChange: function(e){
    console.log('记录天气', e)
    let lw = false
    if(e.detail.value[0]==1){
      lw = true
    }
    this.setData({logWeather: lw })
  },
  bindFieldChange: function(e) {
    let field = this.data.fieldList[e.detail.value]
    if(!field.crop){
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '该地块还未种植作物！'
      })
      this.setData({ currField: null })
      return
    }
    this.setData({
      fieldIndex: e.detail.value,
      currField: field,
      'task.field': field.fieldName,
      'task.crop': field.crop
    })
  },
  bindPeriodChange: function(e) {
    let p = this.data.periodList[e.detail.value]
    this.setData({ selectedPeriodIndex: e.detail.value, 'task.period': p})
  },
  bindOperaterChange: function(e) {
    let p = this.data.operaterList[e.detail.value]
    this.setData({ selectedOperatIndex: e.detail.value, 'task.taskType': p})
  },

  /**
   * 提交表单
   */
  publishLog: function(){
    wx.showLoading({
      title: '加载中',
    })
    var req = this.data.task
    let picStr = this.data.uploadImgs.join(",")
    req.pics=picStr
    wx.request({
      url: app.globalData.apiBaseUrl+'/log/save',
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
            content: '记录成功！',
            showCancel: false,
            success (res2) {
              if (res2.confirm) {
                wx.switchTab({
                  url: '/pages/index/index',
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

  deletePic: function(e){
    let idx = e.currentTarget.dataset.idx
    let pics = this.data.uploadImgs
    pics.splice(idx, 1)
    this.setData({uploadImgs: pics})
  }
})