// pages/user/fav/fav-list.js
const app = getApp()
import utils from '../../../utils/util.js'
import Dialog from '@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    employeeList: null,
    noMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadEmployee()
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
  
  loadEmployee: function(){
    let that = this
    let req = {page: 1}
    if(this.data.employeeList!=null){
      req.page=this.data.employeeList.currentpage
    }
    utils.request(
      app.globalData.apiBaseUrl+'/employee/list',
      req
    ).then(res=>{
      wx.stopPullDownRefresh()
      that.setData({
        employeeList: res.data
      })
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if(this.data.employeeList==null || this.data.employeeList.currentpage==this.data.employeeList.totalpage){
      this.setData({noMore:true})
      return
    }
    let tmp = this.data.employeeList
    tmp.currentpage=tmp.currentpage+1
    this.setData({employeeList: tmp})
    this.loadEmployee()
  },

  //下拉刷新
  onPullDownRefresh(){
    this.setData({employeeList: null})
    this.loadEmployee()
  },

  deleteEmployee: function(e){
    let bid = e.currentTarget.dataset.mid
    let req = {userId: bid}
    let that = this
    Dialog.confirm({
      title: '提示',
      message: '确认该员工已离职吗？',
    }).then(() => {
      utils.request(
        app.globalData.apiBaseUrl+'/employee/delete',
        req
      ).then(res=>{
        that.loadEmployee()
      }).catch(() => {
      });
    })
    
  },
})