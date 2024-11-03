var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fieldList: [],
    cropList: [],
    cropIndx: 0,
    currFieldId: -1,
    currCrop: {}
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
    this.loadFieldList()
    this.loadCropList()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  loadFieldList: function(){
    wx.showLoading({
      title: '正在加载',
    })
    let that = this
    wx.request({
      url: app.globalData.apiBaseUrl+'/field/list', 
      method: 'POST',
      data: {},
      header: {
        'content-type': 'application/json' ,
        'Authorization': wx.getStorageSync('TOKEN')
      },
      success (res) {
        wx.hideLoading()
        console.log(res.data)
        that.setData({
          fieldList: res.data.data
        })
      }
    })
  },

  loadCropList: function(){
    wx.showLoading({
      title: '正在加载',
    })
    let that = this
    wx.request({
      url: app.globalData.apiBaseUrl+'/crop/list', 
      method: 'POST',
      data: {},
      header: {
        'content-type': 'application/json' ,
        'Authorization': wx.getStorageSync('TOKEN')
      },
      success (res) {
        wx.hideLoading()
        console.log(res.data)
        that.setData({
          cropList: res.data.data.records
        })
      }
    })
  },

  onClickField: function(e){
    let fid = e.currentTarget.dataset.fid
    console.log('当前地块：',fid)
    this.setData({currFieldId: fid})
  },

  //删除确认
  onConfirmDelete:function(e){
    let fid = e.currentTarget.dataset.fid
    let cat = e.currentTarget.dataset.category
    let that = this
    let tip = "是否删除该地块？"
    if(cat=="crop"){
      tip = "是否删除该作物"
    }
    wx.showModal({
      title: '提示',
      content: tip,
      success (res) {
        if (res.confirm) {
          if(cat=="crop"){
            that.DeleteCrop(fid)
          }else if(cat=="field"){
            that.DeleteField(fid)
          }
        }
      }
    })
  },

  bindCropChange: function(e) {
    let crop = this.data.cropList[e.detail.value]
    console.log(e.detail.value,crop)
    this.setData({
      cropIndx: e.detail.value,
      currCrop: crop
    })
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定在该地块种植【'+crop.cropName+'】吗？',
      success(res){
        if(res.confirm){
          that.onSubmitPlant()
        }
      }
    })
  },

  //提交种植
  onSubmitPlant: function(){
    let req = {fieldId: this.data.currFieldId, crop: this.data.currCrop.cropName }
    let that = this
    wx.request({
      url: app.globalData.apiBaseUrl+'/field/update', 
      method: 'POST',
      data: req,
      header: {
        'content-type': 'application/json' ,
        'Authorization': wx.getStorageSync('TOKEN')
      },
      success (res) {
        wx.hideLoading()
        that.loadFieldList()
      }
    })
  },

  deletePlant: function(e) {
    let fid = e.currentTarget.dataset.fid
    this.setData({currFieldId: fid})
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定移除该地块的作物吗？',
      success(res){
        if(res.confirm){
          that.onSubmitPlantDelete()
        }
      }
    })
  },

  onSubmitPlantDelete: function(){
    let req = {fieldId: this.data.currFieldId, crop: '-1' }
    let that = this
    wx.request({
      url: app.globalData.apiBaseUrl+'/field/update', 
      method: 'POST',
      data: req,
      header: {
        'content-type': 'application/json' ,
        'Authorization': wx.getStorageSync('TOKEN')
      },
      success (res) {
        wx.hideLoading()
        that.loadFieldList()
      }
    })
  },
})