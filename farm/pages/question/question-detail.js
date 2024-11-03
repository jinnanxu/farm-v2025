const app = getApp()
import utils from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    question: null,
    noMore: false,
    questionId: '',
    answer:{
      questionId: '',
      answerType: 2,
      content: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    this.setData({ questionId: options.qid, 'answer.questionId': options.qid }, res => {
      that.loadQuestion()
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
    this.setData({question: null})
    this.loadQuestion()
  },
  
  //加载问题详情
  loadQuestion: function(){
    let req = {qid: this.data.questionId }
    let that = this //先将this赋值给一个局部变量，否则在request的then函数里无法引用
    utils.request(
      app.globalData.apiBaseUrl+'/question/detail',
      req,
      'POST'
    ).then(res=>{
      //将响应数据赋值给data
      wx.stopPullDownRefresh()
      that.setData({
        question: res.data,
      })
      }
    )
  },

  showLargeImage(e) {
    let currIdx = e.currentTarget.dataset.idx
    let imgList = this.data.question.picList
    let curr = this.data.question.picList[currIdx]
    wx.previewImage({
        urls: imgList, //需要预览的图片http链接列表，注意是数组
        current: curr, // 当前显示图片的http链接，默认是第一个
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
      
  },

  bintDetailInput: function(e){
    this.setData({ 'answer.content': e.detail.value })
  },

  /**
   * 提交表单
   */
  publishAsk: function(){
    wx.showLoading({
      title: '加载中',
    })
    var req = this.data.answer
    wx.request({
      url: app.globalData.apiBaseUrl+'/question/answer',
      header: {
        'content-type': 'application/json' ,
        'Authorization': wx.getStorageSync('TOKEN')
      },
      data: req,
      method: 'POST',
      success(res){
        console.log(res)
        wx.hideLoading()
        if(res.data.code == "0"){
          wx.showModal({
            title: '提示',
            content: '追问成功！',
            showCancel: false,
            success (res2) {
              wx.navigateBack()
            }
          })
        }else{
          wx.showToast({
            title: '系统繁忙，发布失败！',
            icon: 'error'
          })
        }
      }
    })
  },

  //结束问题
  onFinish: function(){
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定该问题已解决了吗？',
      complete: (res) => {
        if (res.confirm) {
          that.finishQuestion()
        }
      }
    })
  },

  finishQuestion: function(){
    let qid = this.data.questionId
    utils.request(
      app.globalData.apiBaseUrl+'/question/finish?qid='+qid,
      {},
      'POST'
    ).then(res=>{
      wx.showToast({
        title: '已解决',
        icon: 'success',
        duration: 1500,
        success() {
          setTimeout(() => {
            wx.navigateBack()
         }, 1500)
       }
      })
    })
  }
})