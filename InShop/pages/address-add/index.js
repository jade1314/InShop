//手动定位
var tcity = require("../../utils/citys.js");
//获取应用实例
var app = getApp()
Page({
  data: {
    //手动定位
    provinces: [],
    province: "",
    citys: [],
    city: "",
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


  //手动定位
  queryAddress: function (latitude, longitude) {  //调用腾讯地图API进行经纬度转换，API限制-每秒5次，单日10000次,下面的key换成自己申请的
    var that = this;
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
        that.setData({ //结果更新至data中
          province: province,
          city: city,
          county: district
        });
        that.syncAddress();

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
        citycode: cityData[val[0]].sub[val[1]].code,
        countycode: cityData[val[0]].sub[val[1]].sub[val[2]].code,
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
        citycode: cityData[val[0]].sub[val[1]].code,
        countycode: cityData[val[0]].sub[val[1]].sub[val[2]].code,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) { //区县是否相同
      console.log('county no');
      this.setData({
        county: this.data.countys[val[2]],
        countycode: cityData[val[0]].sub[val[1]].sub[val[2]].code,
        values: val
      })
      return;
    }


  },
  //手动定位
  onfocus: function (event) {  //打开搜索页面
    // var isSearching = this.data.isSearching;
    // isSearching = !isSearching;
    // this.setData({
    //   searchResult: '',
    //   isSearching: isSearching,
    //   hasSelected: false
    // });

    var city = this.data.city;
    var county = this.data.county;
    var province = this.data.province;

    wx.navigateTo({
      url: '../position-search/index?city=' + city + '&county=' + county + '&province=' + province
    })
  },
  bindCancel:function () {
    wx.navigateBack({})
  },
  bindSave: function(e) {
    var that = this;
    var linkMan = e.detail.value.linkMan;
    var address = e.detail.value.address;
    var mobile = e.detail.value.mobile;
    var code = e.detail.value.code;

    if (linkMan == ""){
      wx.showModal({
        title: '提示',
        content: '请填写联系人姓名',
        showCancel:false
      })
      return
    }
    if (mobile == ""){
      wx.showModal({
        title: '提示',
        content: '请填写手机号码',
        showCancel:false
      })
      return
    }
    if (this.data.selProvince == "请选择"){
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel:false
      })
      return
    }
    if (this.data.selCity == "请选择"){
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel:false
      })
      return
    }
    // var cityId = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].id;
    // var districtId;
    // if (this.data.selDistrict == "请选择" || !this.data.selDistrict){
    //   districtId = '';
    // } else {
    //   districtId = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[this.data.selDistrictIndex].id;
    // }
    if (address == ""){
      wx.showModal({
        title: '提示',
        content: '请填写详细地址',
        showCancel:false
      })
      return
    }
    if (code == ""){
      wx.showModal({
        title: '提示',
        content: '请填写邮编',
        showCancel:false
      })
      return
    }
    var apiAddoRuPDATE = "add";
    var apiAddid = that.data.id;
    if (apiAddid) {
      apiAddoRuPDATE = "update";
    } else {
      apiAddid = 0;
    }
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/shipping-address/' + apiAddoRuPDATE,
      data: {
        token: wx.getStorageSync('token'),
        id: apiAddid,
        // provinceId: commonCityData.cityData[this.data.selProvinceIndex].id,
        cityId: cityId,
        districtId: districtId,
        linkMan:linkMan,
        address:address,
        mobile:mobile,
        code:code,
        isDefault:'true'
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code != 0) {
          // 登录错误 
          wx.hideLoading();
          wx.showModal({
            title: '失败',
            content: res.data.msg,
            showCancel:false
          })
          return;
        }
        // 跳转到结算页面
        wx.navigateBack({})
      }
    })
  },
  
  onLoad: function (e) {
    
    var that = this;

    {
      
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
      if (e.hasSelected) { //从搜索页面回到主页
        this.setData({
          searchResult: e.searchResult,
          houseArea: e.houseArea,
          houseAvgPrice: e.housePrice,
          hasSelected: e.hasSelected,
          province: e.province,
          city: e.city,
          county: e.county,
          active: e.active
        });
        that.syncAddress();
        wx.hideToast();
      } else {


        var that = this;

        var id = e.id;
        if (id) {
          // 初始化原数据
          wx.showLoading();
          wx.request({
            url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/shipping-address/detail',
            data: {
              token: wx.getStorageSync('token'),
              id: id
            },
            success: function (res) {
              wx.hideLoading();
              if (res.data.code == 0) {
                that.setData({
                  id: id,
                  addressData: res.data.data,
                  province: res.data.data.provinceStr,
                  city: res.data.data.cityStr,
                  county: res.data.data.areaStr
                });
                that.setDBSaveAddressId(res.data.data);
                return;
              } else {
                wx.showModal({
                  title: '提示',
                  content: '无法获取快递地址数据',
                  showCancel: false
                })
              }
            }
          })
        }



        wx.getLocation({  //获取地理位置信息-经度纬度
          type: 'wgs84',
          success: function (res) {
            console.log("获取客户当前位置完成");
            var latitude = res.latitude;
            var longitude = res.longitude;
            that.queryAddress(latitude, longitude); //将经纬度转化成地理位置信息
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
  setDBSaveAddressId: function(data) {
    console.log(data);
    
   },
  selectCity: function () {
    
  },
  deleteAddress: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该收货地址吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/shipping-address/delete',
            data: {
              token: wx.getStorageSync('token'),
              id: id
            },
            success: (res) => {
              wx.navigateBack({})
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  readFromWx : function () {
    let that = this;
    wx.chooseAddress({
     
    })
  }
})
