const md5 = require('/utils/md5.js');
App({
  onLoad: function () {
    //检查是否登录
    if (!wx.getStorageSync('user_id')) {
      wx.reLaunch({
        url: '../login/login',
      })
    }
  },
  onLaunch: function () {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，请重启应用',
        success: function (res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })
    //自定义导航栏
    // wx.getSystemInfo({
    //   success: e => {
    //     this.globalData.StatusBar = e.statusBarHeight;
    //     let custom = wx.getMenuButtonBoundingClientRect();
    //     this.globalData.Custom = custom;
    //     this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
    //   }
    // })
    //获取当前学期开学日期
  },
  /** 全局变量 */
  globalData:{
    isDebug:true,
    xdebug:"?XDEBUG_SESSION_START=18446",
    domain:'https://www.yunxiaozhi.cn/v1/public/api/',
    key:'ihzoaixnuy4f8835032505e8a45ac102c52d58593e',
    start_year: 2019,
    start_month: 9,
    start_day: 2,
    amap_key: "67c20c2c7db08923379123500b656adf",
    markers_json: "https://www.yunxiaozhi.cn/v1/resource/markers.json",
    adTime: 24,//小时出现一次
    fileDomain:"http://file.yunxiaozhi.cn/mini/"
  },

  goLogin:function(url){
    wx.navigateTo({
      url: '/pages/bind/bind?url=/'+ url,
    })
  },

  /**
   * 获取请求domain
   */
  getDomain:function(){
    return this.globalData.isDebug ? 'http://127.0.0.1/yunxiaozhi/public/index.php/api/' : 'https://www.yunxiaozhi.cn/v1/public/api/'
  },

  getSign:function(){
    var uid = wx.getStorageSync('user_id')
    var key = this.globalData.key
    var sign = md5.hexMD5(key + uid)
    return sign
  },

  /**
   *  封装request 
   */
  httpRequest: function (datas){
    datas.data = datas.data == undefined ? {} : datas.data
    if (datas.needLogin == undefined || datas.needLogin == true){
      let session = this.getLoginStatus()
      if(session == ""){
        this.msg('请先登录')
        return
      }
      datas.data.session = session
    }
    var that = this,
        isDebug = this.globalData.isDebug,
        domain = this.getDomain(),
        contentType = 'application/json'

    if (typeof datas.method == undefined){
      datas.method = "GET"
    }
    if(datas.method == "POST"){
      contentType = 'application/x-www-form-urlencoded'
    }
    wx.request({
      url: domain + datas.url + (isDebug?this.globalData.xdebug:""),
      data: typeof datas.data == undefined ? '': datas.data,
      method: datas.method,
      header: {
        'content-type': contentType
      },
      success:function(res){
        if(res.data.code == 1101){
          app.msg('请求失败')
        }
        datas.success(res)
      },
      fail:function(res){
        wx.showToast({
          title: '请求超时',
          icon:'none',
          duration:2000
        })
      }
    })
  },

  //toast
  msg:function(text,type){
    var type = typeof type === "undefined" ? '' : type
    var icon = 'none'
    if(type != ''){
      icon = type
    }
    wx.showToast({
      title: text,
      icon: icon,
      duration:2000
    })
  },

  //分享
  share: function (title, img, path){
    if(typeof title == "undefined"){
      return {
        title:"课表成绩考勤校历都在这里",
        imageUrl: this.globalData.fileDomain + 'share/v1/index.png',
        path: 'pages/index/index'
      }
    }
    return {
      title: title,
      path: typeof path === "undefined" ? 'pages/index/index' : path,
      imageUrl: this.globalData.fileDomain + 'share/v1/' + img,
    }
  },

  //强制需要登录
  isLogin:function(){
    let _this = this
    return new Promise((resolve) => {
      let session = wx.getStorageSync('login_session')
      if(session == ''){
        _this.msg('请先登录')
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }, 1000);
        return resolve(false)
      }
      return resolve(true)
    })
    
  },

  //获取登录状态
  getLoginStatus:function(){
    let session = wx.getStorageSync('login_session')
    return session == '' ? false : session
  },

  //获取绑定状态
  getUserId:function(){
    let user_id = wx.getStorageSync('user_id')
    return user_id == '' ? false : user_id
  },

  //获取课表
  getCourse:function(stu_id){
    return new Promise((resolve) => {
      app.httpRequest({
        url: 'course/getList',
        success: function (res) {
          resolve(res.data)
        },
      });
    })
  },

  //promise封装请求
  promiseRequest: function (datas){
    datas.data = datas.data == undefined ? {} : datas.data
    if (datas.needLogin == undefined || datas.needLogin == true){
      let session = this.getLoginStatus()
      if(session == ""){
        this.msg('请先登录')
        return
      }
      datas.data.session = session
    }
    var that = this,
        isDebug = this.globalData.isDebug,
        domain = this.getDomain(),
        contentType = 'application/json'

    if (typeof datas.method == undefined){
      datas.method = "GET"
    }
    if(datas.method == "POST"){
      contentType = 'application/x-www-form-urlencoded'
    }
    let promise = new Promise((resolve,reject) => {
      wx.request({
        url: domain + datas.url + (isDebug?this.globalData.xdebug:""),
        data: typeof datas.data == undefined ? '': datas.data,
        method: datas.method,
        header: {
          'content-type': contentType
        },
        success:function(res){
          if(res.data.status == -1){
            reject(res.data.message)
          }else{
            resolve(res.data)
          }
        },
        fail:function(res){
          wx.showToast({
            title: '请求超时，请重试',
            icon:'none',
            duration:2000
          })
        }
      })
    })
    
    return promise
  },

  //更新毒鸡汤
  requestSouls: function(){
    return this.promiseRequest({
      url: 'soul/getList',
      needLogin: false
    })
  }, 

  //点赞毒鸡汤
  likeSoul: function(id,stu_id){
    return this.promiseRequest({
      url: 'soul/like',
      needLogin: false,
      data: {
        id: id,
        stu_id: stu_id
      }
    })
  }
})