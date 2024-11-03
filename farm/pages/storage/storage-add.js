// pages/publish/publish.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: ['入库', '出库', '盘点'],
    optIdx: 0,
    categoryIndx: 0,
    storage: {
      goodsType: '',
      goodsName: '',
      goodsId: '',
      operateType: 1,
      quantity: '',
      unit: '',
      currAmount: ''
    },
    materials: [],
    mindex: 0,
    currMaterial: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadMaterialList()
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

  loadMaterialList: function(){
    wx.showLoading({
      title: '正在加载',
    })
    let that = this
    let kw = this.data.kw
    wx.request({
      url: app.globalData.apiBaseUrl+'/storage/material/list', 
      method: 'POST',
      data: {kw: kw},
      header: {
        'content-type': 'application/json' ,
        'Authorization': wx.getStorageSync('TOKEN')
      },
      success (res) {
        wx.hideLoading()
        console.log(res.data)
        that.setData({
          materials: res.data.data.records
        })
      }
    })
  },

  bindMaterialChange: function(e) {
    let material = this.data.materials[e.detail.value]
    console.log(e.detail.value,material)
    this.setData({
      mindex: e.detail.value,
      currMaterial: material,
      'storage.goodsType': material.type,
      'storage.goodsName': material.name,
      'storage.goodsId': material.materialId,
      'storage.unit': material.unit
    })
  },

  bindOperateChange: function(e) {
    let sel = parseInt(e.detail.value)
    this.setData({
      optIdx: sel,
      'storage.operateType': sel+1
    })
  },

  bindQuanInput: function(e){
    this.setData({ 'storage.quantity': e.detail.value })
  },
  bindCurrquantityInput: function(e){
    this.setData({ 'storage.currAmount': e.detail.value })
  },

  /**
   * 提交表单
   */
  publishMaterial: function(){
    wx.showLoading({
      title: '加载中',
    })
    let reqData = this.data.storage
    wx.request({
      url: app.globalData.apiBaseUrl+'/storage/save',
      header: {
        'content-type': 'application/json' ,
        'Authorization': wx.getStorageSync('TOKEN')
      },
      data: reqData,
      method: 'POST',
      success(res){
        wx.hideLoading()
        if(res.data.code == "0"){
          wx.showModal({
            title: '提示',
            content: '操作成功！',
            showCancel: false,
            success (res2) {
              if (res2.confirm) {
                wx.navigateBack({
                  delta: 1,
                })
              }
            }
          })
        }else if(res.data.code == "1003"){
          wx.showToast({
            title: '库存不足！',
            icon: 'error'
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