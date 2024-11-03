// pages/publish/publish.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pics: [],
    category: ['农药', '化肥', '作物收储', '种子', '农机', '农具', '其它'],
    categoryIndx: 0,
    material: {
      status: 1,
      name: '',
      type: '农药',
      remark: '',
      unit: '',
      pic: ''
    },
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
    
  },

  //选择图片
  chooseImg: function(){
    let _this = this
    wx.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        console.log(res)
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
              'fileName': tmpFileName
            },
            success (res){
              let resjson = JSON.parse(res.data)
              console.log(resjson.url)
              let picArr = _this.data.pics
              picArr.push(resjson.url)
              _this.setData({
                pics: picArr
              })
              //do something
            }
          })
        }
      }
    })
  },

  bindNameInput: function(e){
    this.setData({ 'material.name': e.detail.value })
  },
  bindUnitInput: function(e){
    this.setData({ 'material.unit': e.detail.value })
  },
  bindAreaInput: function(e){
    this.setData({ 'material.area': e.detail.value })
  },
  bindFieldRemarkInput: function(e){
    this.setData({ 'material.remark': e.detail.value })
  },
  bindCategoryChange: function(e) {
    console.log(e.detail.value, this.data.category)
    let catStr = this.data.category[e.detail.value]
    this.setData({
      categoryIndx: e.detail.value,
      'material.type': catStr
    })
  },

  /**
   * 提交表单
   */
  publishMaterial: function(){
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    let reqData = this.data.material
    reqData.pic = this.data.pics.join(',')
    wx.request({
      url: app.globalData.apiBaseUrl+'/storage/material/save',
      header: {
        'content-type': 'application/json' ,
        'Authorization': wx.getStorageSync('TOKEN')
      },
      data: reqData,
      method: 'POST',
      success(res){
        wx.hideLoading()
        if(res.data.code == "0"){
          that.setData({ 'field': {} })
          wx.showModal({
            title: '提示',
            content: '提交成功！',
            showCancel: false,
            success (res2) {
              if (res2.confirm) {
                wx.navigateBack({
                  delta: 1,
                })
              }
            }
          })
        }else{
          wx.showToast({
            title: '系统繁忙，提交失败！',
            icon: 'error'
          })
        }
      }
    })
  },

})