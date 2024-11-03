// pages/pet/list.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    totalrecords: 0,
    totalpage: 1,
    storageList: null,
    noMore: false
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
    this.loadStorageList()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({storageList: null})
    console.log('RRRR')
    this.loadStorageList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.storageList==null || this.data.storageList.currentpage==this.data.storageList.totalpage){
      this.setData({noMore:true})
      return
    }
    let tmp = this.data.storageList
    tmp.page=tmp.page+1
    this.setData({storageList: tmp})
    this.loadStorageList()
  },

  loadStorageList: function(){
    wx.showLoading({
      title: '正在加载',
    })
    let that = this
    let req = {}
    if(this.data.storageList!=null){
      req.total=this.data.storageList.totalrecord,
      req.page=this.data.storageList.currentpage
    }
    wx.request({
      url: app.globalData.apiBaseUrl+'/storage/history', 
      method: 'POST',
      data: req,
      header: {
        'content-type': 'application/json' ,
        'Authorization': wx.getStorageSync('TOKEN')
      },
      success (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        let existList = that.data.storageList
        if(existList!=null){
          existList.records.concat(res.data.data.records)
          that.setData({
            storageList: existList
          })
        }else{
          that.setData({
            storageList: res.data.data,
            totalrecords: res.data.totalrecords,
            page: res.data.page
          })
        }
      }
    })
  },
  
  toAddPage: function(e){
    wx.navigateTo({
      url: '/pages/storage/storage-add',
    })
  },

})