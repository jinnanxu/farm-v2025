// pages/schedule/add-sch.js
var utils = require("../../utils/util.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    today: '',
    planTime: '08:00',
    fieldList: [],
    fieldIndex: 0,
    currField: null,
    workContent: '',
    remark: '',
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let today = new Date()
    let todayStr = utils.formatDate(today)
    this.setData({today: todayStr})
    this.loadFieldList()
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

  loadFieldList: function(){
    wx.showLoading({
      title: '正在加载',
    })
    let that = this
    wx.request({
      url: app.globalData.apiBaseUrl+'/field/list', 
      method: 'POST',
      data: {},
      header: {
        'content-type': 'application/json' ,
        'Authorization': wx.getStorageSync('TOKEN')
      },
      success (res) {
        wx.hideLoading()
        console.log(res.data)
        that.setData({
          fieldList: res.data.data.records
        })
      }
    })
  },

  bindFieldChange: function(e) {
    let field = this.data.fieldList[e.detail.value]
    this.setData({
      fieldIndex: e.detail.value,
      currField: field
    })
  },

  bindFieldRemarkInput: function(e){
    this.setData({ remark: e.detail.value })
  },
  bindWorkInput: function(e){
    this.setData({ workContent: e.detail.value })
  },
  bindDateChange: function(e) {
    this.setData({today: e.detail.value})
  },
  bindStartTimeChange: function(e) {
    this.setData({ planTime: e.detail.value })
  },

  onSubmitSchedule: function(){
    if(this.data.currField==null){
      wx.showModal({
        title: '提示',
        content: '请选择作业地块',
        showCancel: false
      })
      return
    }
    if(this.data.workContent==''){
      wx.showModal({
        title: '提示',
        content: '请输入工作内容',
        showCancel: false
      })
      return
    }
    let req = {
      fieldId: this.data.currField.fieldId, 
      workContent: this.data.workContent,
      workStatus: 0,
      planTime: this.data.today+' '+this.data.planTime+':00',
      remark: this.data.remark
    }
    wx.request({
      url: app.globalData.apiBaseUrl+'/sch/save', 
      method: 'POST',
      data: req,
      header: {
        'content-type': 'application/json' ,
        'Authorization': wx.getStorageSync('TOKEN')
      },
      success (res) {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '添加成功',
          showCancel: false,
          success(res){
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/schedule/sch-list',
              })
            }
          }
        })
      }
    })
  },
})