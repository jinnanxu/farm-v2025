// pages/user/fav/fav-list.js
const app = getApp()
import utils from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: null,
    noMore: false
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
    this.loadOrderList()
  },
  
  loadOrderList: function(){
    let that = this
    let req = {page: 1}
    if(this.data.orderList!=null){
      req.page=this.data.orderList.currentpage
    }
    utils.request(
      app.globalData.apiBaseUrl+'/market/my/intention/orders',
      req
    ).then(res=>{
      wx.stopPullDownRefresh()
      that.setData({
        orderList: res.data
      })
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if(this.data.orderList==null || this.data.orderList.currentpage==this.data.orderList.totalpage){
      this.setData({noMore:true})
      return
    }
    let tmp = this.data.orderList
    tmp.currentpage=tmp.currentpage+1
    this.setData({orderList: tmp})
    this.loadOrderList()
  },

  //下拉刷新
  onPullDownRefresh(){
    this.setData({orderList: null})
    this.loadOrderList()
  },

  toBlogDetail: function(e){
    let bid = e.currentTarget.dataset.mid
    wx.navigateTo({
      url: '/pages/market/order-detail?mid='+bid,
    })
  },
})