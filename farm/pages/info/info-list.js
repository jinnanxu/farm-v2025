const app = getApp()
import utils from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoList: null,
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
    this.setData({infoList: null})
    this.loadinfoList()
  },

/**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({infoList: null})
    this.loadinfoList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.infoList==null || this.data.infoList.currentpage==this.data.infoList.totalpage){
      this.setData({noMore:true})
      return
    }
    let tmp = this.data.infoList
    tmp.currentpage=tmp.currentpage+1
    this.setData({infoList: tmp})
    this.loadinfoList()
  },
  
  //加载农事作业日志列表
  loadinfoList: function(){
    let req = {}
    if(this.data.infoList!=null){
      req.currentpage=this.data.infoList.currentpage
    }else{
      req.currentpage=1
    }
    let that = this //先将this赋值给一个局部变量，否则在request的then函数里无法引用
    utils.request(
      app.globalData.apiBaseUrl+'/notice/list',
      req,
      'POST'
    ).then(res=>{
      //将响应数据赋值给data
      wx.stopPullDownRefresh()
      let existList = that.data.infoList
      if(existList!=null){
        existList.records.concat(res.data.records)
        that.setData({
          infoList: existList
        })
      }else{
        that.setData({
          infoList: res.data,
          totalrecords: res.data.totalrecords,
          page: res.data.page
        })
      }
    })
  },

  toDetailPage: function(e){
    let mid = e.currentTarget.dataset.mid
    wx.navigateTo({
      url: '/pages/info/info-detail?mid='+mid,
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