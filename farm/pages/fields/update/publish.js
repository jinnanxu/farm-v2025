// pages/publish/publish.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    petImg: [],
    cropCategory: ['咖啡茶', '蔬菜', '中草药', '烟草', '热带作物', '水果', '花卉', '其它'],
    cropCategoryIndx: 0,
    category: '',
    field: {
      status: 1,
      fieldName: '',
      location: '',
      remark: '',
      area: ''
    },
    crop: {
      category: '果类'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      category: options.category
    })
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
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        _this.data.note.pics = []
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
              let picArr = _this.data.note.pics
              picArr.push(resjson.url)
              _this.setData({
                petImg: picArr,
                'note.pics': picArr
              })
              //do something
            }
          })
        }
      }
    })
  },

  bindFieldNameInput: function(e){
    this.setData({ 'field.fieldName': e.detail.value })
  },
  bindFieldLocationInput: function(e){
    this.setData({ 'field.location': e.detail.value })
  },
  bindAreaInput: function(e){
    this.setData({ 'field.area': e.detail.value })
  },
  bindFieldRemarkInput: function(e){
    this.setData({ 'field.remark': e.detail.value })
  },
  bindCropNameInput: function(e){
    this.setData({ 'crop.cropName': e.detail.value })
  },
  bindCropCategoryChange: function(e) {
    let catStr = this.data.cropCategory[e.detail.value]
    this.setData({
      cropCategoryIndx: e.detail.value,
      'crop.category': catStr
    })
  },
  bindCropRemarkInput: function(e){
    this.setData({ 'crop.remark': e.detail.value })
  },

  /**
   * 提交地块表单
   */
  publishField: function(){
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.request({
      url: app.globalData.apiBaseUrl+'/field/save',
      header: {
        'content-type': 'application/json' ,
        'Authorization': wx.getStorageSync('TOKEN')
      },
      data: that.data.field,
      method: 'POST',
      success(res){
        console.log(res)
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
            title: '系统繁忙，发布失败！',
            icon: 'error'
          })
        }
      }
    })
  },

  publishCrop: function(){
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.request({
      url: app.globalData.apiBaseUrl+'/crop/save',
      header: {
        'content-type': 'application/json' ,
        'Authorization': wx.getStorageSync('TOKEN')
      },
      data: that.data.crop,
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
            title: '系统繁忙，发布失败！',
            icon: 'error'
          })
        }
      }
    })
  },

})