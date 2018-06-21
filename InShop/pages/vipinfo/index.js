Page({
  data: {
    id: '185****4420',
    date: '点击选择日期',
    items: [
      {
        value: 'man', item: '男', checked: false
      },
      {
        value: 'wemen', item: '女', checked: false
      }
    ],
  },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)

    var items = this.data.items, values = e.detail.value;
    for (var i = 0, lenI = items.length; i < lenI; ++i) {
      items[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (items[i].value == values[j]) {
          items[i].checked = true;
          break
        }
      }
    }

    this.setData({
      items: items
    })
  }
})

