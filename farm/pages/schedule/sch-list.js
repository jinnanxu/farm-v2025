// pages/schedule/sch-list.js
var utils = require("../../utils/util.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    schList: null,
    workStatus: -1,
    showFilter: true
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
    this.loadSchList()
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

  toAddPage: function(){
    wx.navigateTo({
      url: '/pages/schedule/add-sch',
    })
  },

  onPullDownRefresh: function(){
    this.setData({showFilter: false})
    this.loadSchList()
  },

  loadSchList: function(){
    wx.showLoading({
      title: '正在加载',
    })
    let that = this
    let req = {status:this.data.workStatus}
    if(this.data.schList!=null){
        req.total=this.data.schList.totalrecord,
        req.page=this.data.schList.currentpage
    }
    wx.request({
      url: app.globalData.apiBaseUrl+'/sch/list', 
      method: 'POST',
      data: req,
      header: {
        'content-type': 'application/json' ,
        'Authorization': wx.getStorageSync('TOKEN')
      },
      success (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh({
          success: (res) => {
            that.setData({showFilter: true})
          },
        })
        that.setData({
          schList: res.data.data
        })
      }
    })
  },

  onFilter: function(e){
    let s = e.currentTarget.dataset.status
    console.log('当前筛选：',s)
    let that = this
    this.setData({workStatus: s, schList: null}, res=>{
      that.loadSchList()
    })
  },

  //开始作业
  onStartWork: function(e){
    let sid = e.currentTarget.dataset.sid
    let req ={
      scheduleId: sid,
      workStatus: 1
    }
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定开始该作业？',
      success(res){
        if(res.confirm){
          that.updateSchedule(req)
        }
      }
    })
  },

  //完成作业
  onFinishtWork: function(e){
    let sid = e.currentTarget.dataset.sid
    let req ={
      scheduleId: sid,
      workStatus: 2
    }
    let that =this
    wx.showModal({
      title: '提示',
      content: '确定已完成该作业？',
      success(res){
        if(res.confirm){
          that.updateSchedule(req)
        }
      }
    })
  },

  updateSchedule: function(req){
    let that = this
    wx.request({
      url: app.globalData.apiBaseUrl+'/sch/update', 
      method: 'POST',
      data: req,
      header: {
        'content-type': 'application/json' ,
        'Authorization': wx.getStorageSync('TOKEN')
      },
      success (res) {
        wx.hideLoading()
        that.loadSchList()
      }
    })
  }
})