// pages/pet/list.js
var app = getApp()
import utils from '../../utils/util.js'
import Dialog from '@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fieldList: [],
    cropList: [],
    kw: '',
    category: 'field'
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
    if(this.data.category=='field'){
      this.loadFieldList()
    }else if(this.data.category=='crop'){
      this.loadCropList()
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if(this.data.category=='field'){
      this.loadFieldList()
    }else if(this.data.category=='crop'){
      this.loadCropList()
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  loadFieldList: function(){
    let that = this
    let req = {kw: this.data.kw}
    utils.request(
      app.globalData.apiBaseUrl+'/field/list',
      req,
      'POST'
    ).then(res=>{
      //将响应数据赋值给data
      wx.stopPullDownRefresh()
      console.log(res.data)
      that.setData({
        fieldList: res.data
      })
    })
  },

  loadCropList: function(){
    let that = this
    let req = {kw: this.data.kw}
    utils.request(
      app.globalData.apiBaseUrl+'/crop/list',
      req,
      'POST'
    ).then(res=>{
      //将响应数据赋值给data
      wx.stopPullDownRefresh()
      console.log(res.data)
      that.setData({
        cropList: res.data
      })
    })
  },

  bindKwChange: function (e) {
    this.setData({ kw: e.detail.value })
  },

  searchNote:function(){
    this.loadfieldList()
  },
  
  toAddPage: function(e){
    // 鉴权
    let userInfo = wx.getStorageSync('LOGIN_USER')
    if(userInfo.role!=1){
      Dialog.alert({
        title: '提示',
        message: '当前用户无操作权限',
      }).then(() => {})
      return false
    }
    let category = e.currentTarget.dataset.category
    wx.navigateTo({
      url: '/pages/fields/update/publish?category='+category,
    })
    if(category=='field'){

    }else if(category=='crop'){

    }
  },

  //删除确认
  onConfirmDelete:function(e){
    let userInfo = wx.getStorageSync('LOGIN_USER')
    if(userInfo.role!=1){
      Dialog.alert({
        title: '提示',
        message: '当前用户无操作权限',
      }).then(() => {})
      return false
    }
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

  //删除地块
  DeleteField: function(fid){
    let that = this
    let req = {
      fieldId: fid,
      status: -1
    }
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

  DeleteCrop: function(fid){
    let that = this
    let req = {
      cropId: fid,
      status: -1
    }
    wx.request({
      url: app.globalData.apiBaseUrl+'/crop/update', 
      method: 'POST',
      data: req,
      header: {
        'content-type': 'application/json' ,
        'Authorization': wx.getStorageSync('TOKEN')
      },
      success (res) {
        wx.hideLoading()
        that.loadCropList()
      }
    })
  }
})