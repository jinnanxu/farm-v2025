// pages/publish/publish.js
var app = getApp()
import utils from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadImgs: [],
    infoTypes:["出售","采购"],
    selectedTypeIndex: 0,
    market: {
      infoType: '',
      title: '',
      price: '',
      mobile: '',
      address: '',
      detail: '',
      pics: ''
    },
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
    let isLogin = utils.checkLogin()
    if(!isLogin){
      //进入授权登录页面
      wx.redirectTo({
        url: '/pages/user/login/login',
      })
    }
  },

  //选择图片
  chooseImg: function(){
    let _this = this
    wx.chooseMedia({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      mediaType: ['image'],
      success (res) {
        console.log(res)
        wx.showLoading({
          title: '上传图片中...',
        })
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFiles
        for(var idx=0; idx<tempFilePaths.length; idx++){
          var tmpFileName = tempFilePaths[0].tempFilePath.substring(tempFilePaths[idx].tempFilePath.lastIndexOf('/')+1)
          wx.uploadFile({
            url: 'http://129.211.222.131:16602/upload-server/upload', //图片服务器
            filePath: tempFilePaths[idx].tempFilePath,
            name: 'myFile',
            formData: {
              'user': 'test',
              'u': app.globalData.uid,
              'fileName': tmpFileName
            },
            success (res){
              //上传成功回调
              wx.hideLoading()
              let resjson = JSON.parse(res.data)
              console.log(resjson.url)
              let picArr = _this.data.uploadImgs
              picArr.push(resjson.url)
              _this.setData({
                uploadImgs: picArr
              })
            }
          })
        }
      }
    })
  },

  bintDetailInput: function(e){
    this.setData({ 'market.detail': e.detail.value })
  },
  bindTitleInput: function(e){
    this.setData({ 'market.title': e.detail.value })
  },
  bindPriceInput: function(e){
    this.setData({ 'market.price': e.detail.value })
  },
  bindMobileInput: function(e){
    this.setData({ 'market.mobile': e.detail.value })
  },
  bindAddressInput: function(e){
    this.setData({ 'market.address': e.detail.value })
  },
  
  bindInfoTypeChange: function(e) {
    let p = parseInt(e.detail.value)
    this.setData({ selectedTypeIndex: e.detail.value, 'market.infoType': (p+1)})
  },

  /**
   * 提交表单
   */
  publishLog: function(){
    wx.showLoading({
      title: '加载中',
    })
    var req = this.data.market
    let picStr = this.data.uploadImgs.join(",")
    req.pics=picStr
    wx.request({
      url: app.globalData.apiBaseUrl+'/market/save',
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
            content: '发布成功！',
            showCancel: false,
            success (res2) {
              if (res2.confirm) {
                wx.switchTab({
                  url: '/pages/market/market-info',
                })
              }
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

  deletePic: function(e){
    let idx = e.currentTarget.dataset.idx
    let pics = this.data.uploadImgs
    pics.splice(idx, 1)
    this.setData({uploadImgs: pics})
  }
})