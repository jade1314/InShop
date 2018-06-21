// pages/often-list/index.js

// 引用百度地图微信小程序JSAPI模块 
var bmap = require('../../common/lib/bmap-wx.js');
var wxMarkerData = [];
var timer;
// 新建百度地图对象 
var BMap = new bmap.BMapWX({
  ak: 'I1Gd295gGSWmYh0xW6uqgGN3lXKDiAB4'
});
//手动定位
var tcity = require("../../utils/citys.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalData: '',
    addressText: '',
    warning: '',
    myanimation: '',
    mylocation: '',
    //手动定位
    provinces: [],
    province: "",
    citys: [],
    city: "",
    inputtext: "",
    countys: [],
    county: '',
    citycode: "",
    countycode: "",
    value: [0, 0, 0],
    values: [0, 0, 0],
    searchResults: [],
    searchResult: '请输入具体楼/栋/门牌号',
    houseArea: '',
    houseAvgPrice: '',
    condition: false,
    isSearching: false,
    hasSelected: false
  },

  // 绑定input输入 
  listenerSearchInput: function (e) {
    var that = this;

    var fail = function (data) {
      console.log(data)
    };
    that.setData({
      inputtext: e.detail.value,
    });
    var success = function (data) {
      let totalData = data.result;
      that.setData({
        totalData: totalData,
      });
      wx.setStorageSync('nearbylocation', totalData);
    }

    // 发起suggestion检索请求 
    BMap.suggestion({
      query: e.detail.value,
      region: '北京',
      city_limit: true,
      fail: fail,
      success: success
    });
  },


  //手动定位
  queryAddress: function (latitude, longitude) {  //调用腾讯地图API进行经纬度转换，API限制-每秒5次，单日10000次,下面的key换成自己申请的
    var _that = this;
    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + latitude + ',' + longitude + '&key=LCMBZ-NMFWS-XUTOR-6CNF5-TNN3Q-X3FAG',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        var province = res.data.result.ad_info.province;
        var city = res.data.result.ad_info.city;
        var district = res.data.result.ad_info.district;
        _that.setData({ //结果更新至data中
          province: province,
          city: city,
          county: district
        });
        _that.syncAddress();

      }
    });

  },
  //手动定位
  syncAddress: function () {
    //获取用户所在地区并转换成相应的value记入data
    var val = this.data.value;
    var t = this.data.values;
    var cityData = this.data.cityData;

    var curProvince = this.data.province;
    var curCity = this.data.city;
    var curCounty = this.data.county;

    for (let i = 0; i < cityData.length; i++) {
      if (curProvince == cityData[i].name) {
        val[0] = i;
      }
    }

    for (let j = 0; j < cityData[val[0]].sub.length; j++) {
      if (curCity == cityData[val[0]].sub[j].name) {
        val[1] = j;
      }
    }

    for (let k = 0; k < cityData[val[0]].sub[val[1]].sub.length; k++) {
      if (curCounty == cityData[val[0]].sub[val[1]].sub[k].name) {
        val[2] = k;
      }
    }

    console.log(val[0], val[1], val[2]);

    //将客户所在地区的城市与区县记录进Page.data
    const citys = [];
    const countys = [];

    // console.log(cityData[val[0]].sub[val[1]].sub[val[2]].name);

    for (var l = 0; l < cityData[val[0]].sub.length; l++) {
      citys.push(cityData[val[0]].sub[l].name);
    }

    for (var m = 0; m < cityData[val[0]].sub[val[1]].sub.length; m++) {
      countys.push(cityData[val[0]].sub[val[1]].sub[m].name);
    }

    console.log('city,county完成');

    this.setData({
      'citys': citys,
      'countys': countys,
      'value': val,
      'values': val
    });
  },
  //手动定位
  open: function (event) { //打开地址选择picker

    this.setData({
      condition: true
    });
  },
  //手动定位
  close: function () {
    this.setData({
      condition: false
    });
  },

  selectlocation: function (e) {
    var singleData = e.currentTarget.dataset.backdata;
    console.log(singleData);
    this.setData({
      addressText: singleData.name,
      warning: "无法配送"
    });
    wx.setStorageSync("mylocation", singleData.name)

  },

  imageAnimation: function () {
    var circleCount = 0;

    timer = setInterval(function () {
      if (circleCount % 2 == 0) {
        this.animation.scale(0.1).step();
      } else {
        this.animation.scale(1.0).step();
      }
      this.setData({
        animation: this.animation.export()  //输出动画  
      });

      circleCount++;
      if (circleCount == 4) clearTimeout(timer);

    }.bind(this), 200);
  },


  relocation: function () {
    this.imageAnimation();

    var that = this;

    var fail = function (data) {
      console.log(data);
    };
    var success = function (data) {
      wxMarkerData = data.wxMarkerData;
      that.setData({
        addressText: wxMarkerData[0].address,
        city: data.originalData.result.addressComponent.city,
        warning: "无法配送",
      });
      wx.setStorageSync("mylocation", wxMarkerData[0].address);
      wx.setStorageSync("city", wxMarkerData[0].city);

    };
    // 发起regeocoding检索请求 
    BMap.regeocoding({
      fail: fail,
      success: success,
      iconPath: '../../img/marker_red.png',
      iconTapPath: '../../img/marker_red.png'
    });

  },

  // selectCity: function(e) {
  //   wx.request({
  //     url: 'https://xwl5242.free.ngrok.cc/sys/user/findList',
  //     data: {pageNo:1,
  //            pageSize:2
  //            },
  //     header: {
  //       "content-type": "application/json"
  //     },
  //     method: 'GET',
  //     success(data) {
  //       console.log(data);
  //     },
  //     fail(data) {

  //     }
  //   });
  // },


  //手动定位
  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  bindChange: function (event) {  //当picker列表变化时，相应修改地区input中显示的位置值

    var val = event.detail.value;
    var t = this.data.values;
    var cityData = this.data.cityData;

    this.setData({
      hasSelected: false
    });

    if (val[0] != t[0]) { //省份是否相同
      console.log('province no ');
      const citys = [];
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], 0, 0]
      })

      return;
    }
    if (val[1] != t[1]) { //城市是否相同
      console.log('city no');
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }

      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) { //区县是否相同
      console.log('county no');
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }


  },

  toSearch: function (e) {

  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.animation = wx.createAnimation({
      duration: 200,    // 以毫秒为单位    
      timingFunction: 'linear',
      success: function (res) {

      }
    })
    //获取附近列表
    var nearbylocation = wx.getStorageSync('nearbylocation');
    var mylocation = wx.getStorageSync("mylocation");
    //获取当前设置位置
    this.setData({
      totalData: nearbylocation,
      addressText: mylocation,
    });

    //手动定位
    {
      var that = this;
      tcity.init(that); //将城市列表载入data
      var cityData = that.data.cityData;
      const provinces = [];
      for (let i = 0; i < cityData.length; i++) {
        provinces.push(cityData[i].name); //将省份信息记入provinces数组
      }
      console.log('省份完成');
      that.setData({
        'provinces': provinces //储存在Page.data中 
      })
      if (options.hasSelected) { //从搜索页面回到主页
        this.setData({
          searchResult: options.searchResult,
          houseArea: options.houseArea,
          houseAvgPrice: options.housePrice,
          hasSelected: options.hasSelected,
          province: options.province,
          city: options.city,
          county: options.county,
          active: options.active
        });
        _that.syncAddress();
        wx.hideToast();
      } else {

        wx.getLocation({  //获取地理位置信息-经度纬度
          type: 'wgs84',
          success: function (res) {
            console.log("获取客户当前位置完成");
            var latitude = res.latitude;
            var longitude = res.longitude;
            _that.queryAddress(latitude, longitude); //将经纬度转化成地理位置信息
            wx.hideToast();
          },
          fail: function () {
            wx.showModal({
              title: '获取地理位置失败',
              content: '请您允许小程序获取您所在的位置信息。',
              showCancel: false
            })
          }
        });
      }
      console.log('初始化完成');
    }
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

