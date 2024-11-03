const app = getApp()
import utils from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    marketList: null,
    noMore: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    this.setData({marketList: null})
    this.loadmarketList()
  },

/**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({marketList: null})
    this.loadmarketList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.marketList==null || this.data.marketList.currentpage==this.data.marketList.totalpage){
      this.setData({noMore:true})
      return
    }
    let tmp = this.data.marketList
    tmp.currentpage=tmp.currentpage+1
    this.setData({marketList: tmp})
    this.loadmarketList()
  },
  
  //加载农事作业日志列表
  loadmarketList: function(){
    let req = {}
    if(this.data.marketList!=null){
      req.currentpage=this.data.marketList.currentpage
    }else{
      req.currentpage=1
    }
    let that = this //先将this赋值给一个局部变量，否则在request的then函数里无法引用
    utils.request(
      app.globalData.apiBaseUrl+'/market/list',
      req,
      'POST'
    ).then(res=>{
      //将响应数据赋值给data
      wx.stopPullDownRefresh()
      let existList = that.data.marketList
      if(existList!=null){
        existList.records.concat(res.data.records)
        that.setData({
          marketList: existList
        })
      }else{
        that.setData({
          marketList: res.data,
          totalrecords: res.data.totalrecords,
          page: res.data.page
        })
      }
    })
  },

  toAddPage: function(){
    wx.navigateTo({
      url: '/pages/market/publish-info',
    })
  },

  toDetailPage: function(e){
    let mid = e.currentTarget.dataset.mid
    wx.navigateTo({
      url: '/pages/market/info-detail?mid='+mid,
    })
  },

  onCall: function(e){
    console.log(e)
    let number = e.currentTarget.dataset.mobile
    wx.makePhoneCall({
      phoneNumber: number
    })
  }
})