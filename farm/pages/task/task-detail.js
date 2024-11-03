const app = getApp()
import utils from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    this.setData({
      mid: options.mid
    }, ()=>{
      that.loadTaskDetail()
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

  //加载详情
  loadTaskDetail: function(){
    let that = this
    utils.request(
      app.globalData.apiBaseUrl+'/log/detail?tid='+that.data.mid,
      {},
      'GET'
    ).then(res=>{
      wx.stopPullDownRefresh()
      that.setData({
        item: res.data
      })
    })
  },

  showLargeImage(e) {
    let currIdx = e.currentTarget.dataset.idx
    let curr = ''
    let imgList = []
    for(var idx=0; idx<this.data.item.picList.length; idx++){
        imgList.push(this.data.item.picList[idx])
        if(currIdx==idx){
            curr = this.data.item.picList[idx]
        }
    }
    wx.previewImage({
        urls: imgList, //需要预览的图片http链接列表，注意是数组
        current: curr, // 当前显示图片的http链接，默认是第一个
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
      
  },
})