// pages/pet/list.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    materialList: [],
    category: 'field'
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
    this.loadMaterialList()
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
          materialList: res.data.data
        })
      }
    })
  },

  bindKwChange: function (e) {
    this.setData({ kw: e.detail.value })
  },

  searchNote:function(){
    this.loadMaterialList()
  },
  
  toAddPage: function(e){
    let category = e.currentTarget.dataset.category
    wx.navigateTo({
      url: '/pages/storage/material/add-material',
    })
    if(category=='field'){

    }else if(category=='crop'){

    }
  },

  //删除确认
  onConfirmDelete:function(e){
    let fid = e.currentTarget.dataset.fid
    let that = this
    let tip = "是否删除该物资？"
    wx.showModal({
      title: '提示',
      content: tip,
      success (res) {
        if (res.confirm) {
          that.DeleteMaterial(fid)
        }
      }
    })
  },

  DeleteMaterial: function(fid){
    let that = this
    let req = {
      materialId: fid,
      status: -1
    }
    wx.request({
      url: app.globalData.apiBaseUrl+'/storage/material/update', 
      method: 'POST',
      data: req,
      header: {
        'content-type': 'application/json' ,
        'Authorization': wx.getStorageSync('TOKEN')
      },
      success (res) {
        wx.hideLoading()
        that.loadMaterialList()
      }
    })
  }
})