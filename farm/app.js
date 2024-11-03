// app.js
App({
  onLaunch() {
    let loginUser = wx.getStorageSync('LOGIN_USER')
    // if(loginUser!=null&&loginUser!=''){
    //   this.globalData.userInfo=loginUser
    // }
  },
  globalData: {
    // apiBaseUrl: 'http://localhost:8092/farm-api',
    apiBaseUrl: 'http://129.211.222.131:8192/farm-api',
    userInfo: null,
    uid: 'a4859005-42e5-6d5d-e584-525w2w3kw885',
    currCity: null,
    locationData: null
  }
})
