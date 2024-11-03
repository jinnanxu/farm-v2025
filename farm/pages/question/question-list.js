const app = getApp()
import utils from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionList: null,
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
    this.setData({questionList: null})
    this.loadquestionList()
  },

/**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({questionList: null})
    this.loadquestionList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.questionList==null || this.data.questionList.currentpage==this.data.questionList.totalpage){
      this.setData({noMore:true})
      return
    }
    let tmp = this.data.questionList
    tmp.currentpage=tmp.currentpage+1
    this.setData({questionList: tmp})
    this.loadquestionList()
  },
  
  //加载农事咨询列表
  loadquestionList: function(){
    let req = {}
    if(this.data.questionList!=null){
      req.currentpage=this.data.questionList.currentpage
    }else{
      req.currentpage=1
    }
    let that = this //先将this赋值给一个局部变量，否则在request的then函数里无法引用
    utils.request(
      app.globalData.apiBaseUrl+'/question/list',
      req,
      'POST'
    ).then(res=>{
      //将响应数据赋值给data
      wx.stopPullDownRefresh()
      let existList = that.data.questionList
      if(existList!=null){
        existList.records.concat(res.data.records)
        that.setData({
          questionList: existList
        })
      }else{
        that.setData({
          questionList: res.data,
          totalrecords: res.data.totalrecords,
          page: res.data.page
        })
      }
    })
  },

  toAddPage: function(){
    wx.navigateTo({
      url: '/pages/question/publish-question',
    })
  },

  toDetailPage: function(e){
    let mid = e.currentTarget.dataset.qid
    wx.navigateTo({
      url: '/pages/question/question-detail?qid='+mid,
    })
  },
})