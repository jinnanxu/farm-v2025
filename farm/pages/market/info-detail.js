const app = getApp()
import utils from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    marketInfo: null,
    noMore: false,
    mid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    this.setData({
      mid: options.mid
    }, ()=>{
      that.loadmarketInfo()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    
  },

/**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({marketInfo: null})
    this.loadmarketInfo()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({marketInfo: null})
    this.loadmarketInfo()
  },
  
  //加载市场信息详情
  loadmarketInfo: function(){
    let that = this
    let req = {
      mid: that.data.mid
    }
    utils.request(
      app.globalData.apiBaseUrl+'/market/detail',
      req,
      'POST'
    ).then(res=>{
      wx.stopPullDownRefresh()
      that.setData({
        marketInfo: res.data
      })
    })
  },

  toAddPage: function(){
    wx.navigateTo({
      url: '/pages/market/publish-info',
    })
  },

  toOrderPage: function(e){
    let mid = e.currentTarget.dataset.mid
    wx.navigateTo({
      url: '/pages/market/order-confirm?mid='+mid,
    })
  },

  onCall: function(e){
    console.log(e)
    let number = e.currentTarget.dataset.mobile
    wx.makePhoneCall({
      phoneNumber: number
    })
  },

  showLargeImage(e) {
    let currIdx = e.currentTarget.dataset.idx
    let imgList = this.data.marketInfo.picList
    let curr = this.data.marketInfo.picList[currIdx]
    wx.previewImage({
        urls: imgList, //需要预览的图片http链接列表，注意是数组
        current: curr, // 当前显示图片的http链接，默认是第一个
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
      
  },
})