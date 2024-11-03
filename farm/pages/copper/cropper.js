// pages/pet/pet-add.js
var app = getApp()
import util from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCropper: false,
    src: '',
    width: 250,//宽度
    height: 250,//高度
    max_width: 400,
    max_height: 400,
    img_width: 300,
    img_height: 300,
    disable_rotate: true,//是否禁用旋转
    disable_ratio: true,//锁定比例
    limit_move: true,//是否限制移动
    export_scale: 1,
    quality: 0 //生成的图片质量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //获取到image-cropper实例
    this.cropper = this.selectComponent("#image-cropper");
    let picUrl = options.picurl
    this.setData({src: picUrl})
    //开始裁剪
    // this.setData({
    //     src:"http://129.211.222.131:18080/images/20210325085826o2tav.jpg",
    // });
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

  /***********头像图片剪切************* */
  cropperload(e) {
    console.log('cropper加载完成');
  },
  loadimage(e) {
    wx.hideLoading();
    console.log('图片');
    this.cropper.imgReset();
  },
  clickcut(e) {
    console.log(e.detail);
    //图片预览
    wx.previewImage({
      current: e.detail.url, // 当前显示图片的http链接
      urls: [e.detail.url] // 需要预览的图片http链接列表
    })
  },
  setWidth(e) {
    this.setData({
      width: e.detail.value < 10 ? 10 : e.detail.value
    });
    this.setData({
      cut_left: this.cropper.data.cut_left
    });
  },
  setHeight(e) {
    this.setData({
      height: e.detail.value < 10 ? 10 : e.detail.value
    });
    this.setData({
      cut_top: this.cropper.data.cut_top
    });
  },
  setCutTop(e) {
    this.setData({
      cut_top: e.detail.value
    });
    this.setData({
      cut_top: this.cropper.data.cut_top
    });
  },
  setCutLeft(e) {
    this.setData({
      cut_left: e.detail.value
    });
    this.setData({
      cut_left: this.cropper.data.cut_left
    });
  },
  switchChangeDisableHeight(e) {
    this.setData({
      disable_height: e.detail.value
    });
  },

  //把裁剪好的图片上传到云服务器
  submit() {
    this.cropper.getImg((obj) => {
      console.log(obj.url);
      let tempFilePaths = obj.url
      let tmpFileName = tempFilePaths.substring(tempFilePaths.lastIndexOf('/')+1)
      wx.uploadFile({
        url: 'http://129.211.222.131:16602/upload-server/upload', //图片服务器
        filePath: tempFilePaths,
        name: 'myFile',
        formData: {
          'user': 'test',
          'fileName': tmpFileName,
          'u': app.globalData.uid
        },
        success: function (res) {
          let resjson = JSON.parse(res.data)
          console.log(resjson.url)
          wx.showToast({
            title: '图片上传成功',
            icon: 'none',
            duration: 2000
          })
          app.globalData.imgSrc = resjson.url;
          wx.navigateBack({
            delta: -1
          })
        },
        fail: function (error) {
          wx.showToast({
            title: '图片上传失败',
            icon: 'none',
            duration: 2000
          })
        },
      })
    });
  },
  rotate() {
    //在用户旋转的基础上旋转90°
    this.cropper.setAngle(this.cropper.data.angle += 90);
  },
  end(e) {
    clearInterval(this.data[e.currentTarget.dataset.type]);
  },
  reset(){
    this.cropper.imgReset();
  },
  cancel(){
      wx.navigateBack({
        delta: -1
      })
  }
})