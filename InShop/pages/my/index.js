const app = getApp()

Page({
  data: {
    balance: 0,
    freeze: 0,
    score: 0,
    score_sign_continuous: 0
  },
  onLoad() {

  },

  willpay: function(){
    wx.navigateTo({
      url: '/pages/order-list/index',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  onShow() {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.navigateTo({
        url: "/pages/authorize/index"
      })
    } else {
      that.setData({
        userInfo: userInfo,
        version: app.globalData.version
      })
    }
    this.getUserApiInfo();
    this.getUserAmount();
    this.checkScoreSign();
  },
  aboutUs: function () {
    // wx.showModal({
    //   title: '关于我们',
    //   content: '京东JD.COM-专业的综合网上购物商城，销售超数万品牌、4020万种商品，囊括家电、手机、电脑、母婴、服装等13大品类。秉承客户为先的理念，京东所售商品为正品行货、全国联保、机打发票。',
    //   showCancel:false
    // })
    wx.makePhoneCall({
      phoneNumber: '110',
    });
  },
  getLocation: function () {
    wx.getLocation({
      success: function (res) {
        wx.showModal({
          title: '12',
          content: '1212',
        })
      },
    })
  },

  getPhoneNumber: function (e) {
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        title: '提示',
        content: '无法获取手机号码',
        showCancel: false
      })
      return;
    }
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/wxapp/bindMobile',
      data: {
        token: wx.getStorageSync('token'),
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 2000
          })
          that.getUserApiInfo();
        } else {
          wx.showModal({
            title: '提示',
            content: '绑定失败',
            showCancel: false
          })
        }
      }
    })
  },
  getUserApiInfo: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/detail',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            apiUserInfoMap: res.data.data,
            userMobile: res.data.data.base.mobile
          });
        }
      }
    })

  },
  getUserAmount: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/amount',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            balance: res.data.data.balance,
            freeze: res.data.data.freeze,
            score: res.data.data.score
          });
        }
      }
    })

  },
  checkScoreSign: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/score/today-signed',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            score_sign_continuous: res.data.data.continuous
          });
        }
      }
    })
  },
  scoresign: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/score/sign',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.getUserAmount();
          that.checkScoreSign();
        } else {
          wx.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })
  },
  relogin: function () {
    wx.navigateTo({
      url: "/pages/authorize/index"
    })
  },
  recharge: function () {
    wx.navigateTo({
      url: "/pages/recharge/index"
    })
  },
  withdraw: function () {
    wx.navigateTo({
      url: "/pages/withdraw/index"
    })
  }
})