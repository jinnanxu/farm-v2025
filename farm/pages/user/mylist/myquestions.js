// pages/user/fav/fav-list.js
const app = getApp()
import utils from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionList: null,
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
    let req = {}
    if(this.data.questionList!=null){
      req.total=this.data.questionList.totalrecord,
      req.page=this.data.questionList.currentpage
    }
    utils.request(
      app.globalData.apiBaseUrl+'/question/user/myquestion',
      req
    ).then(res=>{
      wx.stopPullDownRefresh()
      that.setData({
        questionList: res.data
      })
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if(this.data.questionList==null || this.data.questionList.currentpage==this.data.questionList.totalpage){
      this.setData({noMore:true})
      return
    }
    let tmp = this.data.questionList
    tmp.currentpage=tmp.currentpage+1
    this.setData({questionList: tmp})
    this.loadBlogList()
  },

  //下拉刷新
  onPullDownRefresh(){
    this.setData({questionList: null})
    this.loadBlogList()
  },

  toBlogDetail: function(e){
    let qid = e.currentTarget.dataset.qid
    wx.navigateTo({
      url: '/pages/question/question-detail?qid='+qid,
    })
  },
})