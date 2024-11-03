// pages/user/fav/fav-list.js
const app = getApp()
import utils from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    marketList: null,
    noMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadBlogList()
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
  
  loadBlogList: function(){
    let that = this
    let req = {page: 1}
    if(this.data.marketList!=null){
      req.page=this.data.marketList.currentpage
    }
    utils.request(
      app.globalData.apiBaseUrl+'/market/user/mymarket',
      req
    ).then(res=>{
      wx.stopPullDownRefresh()
      that.setData({
        marketList: res.data
      })
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if(this.data.marketList==null || this.data.marketList.currentpage==this.data.marketList.totalpage){
      this.setData({noMore:true})
      return
    }
    let tmp = this.data.marketList
    tmp.currentpage=tmp.currentpage+1
    this.setData({marketList: tmp})
    this.loadmarketList()
  },

  //下拉刷新
  onPullDownRefresh(){
    this.setData({marketList: null})
    this.loadmarketList()
  },

  toBlogDetail: function(e){
    let bid = e.currentTarget.dataset.mid
    wx.navigateTo({
      url: '/pages/market/info-detail?mid='+bid,
    })
  },
})