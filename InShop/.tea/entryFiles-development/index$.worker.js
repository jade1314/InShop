require('./config$');

function success() {
require('../..//app');
require('../..//pages/start/start');
require('../..//pages/index/index');
require('../..//pages/goods-details/index');
require('../..//pages/shop-cart/index');
require('../..//pages/to-pay-order/index');
require('../..//pages/select-address/index');
require('../..//pages/address-add/index');
require('../..//pages/order-list/index');
require('../..//pages/order-details/index');
require('../..//pages/wuliu/index');
require('../..//pages/mycoupons/index');
require('../..//pages/my/index');
require('../..//pages/notice/show');
require('../..//pages/recharge/index');
require('../..//pages/withdraw/index');
require('../..//pages/kanjia/index');
require('../..//pages/authorize/index');
require('../..//pages/gohome/index');
require('../..//pages/vipinfo/index');
require('../..//pages/often-list/index');
require('../..//pages/order-detail/index');
require('../..//pages/new-detail/index');
require('../..//pages/shopping-list/index');
require('../..//pages/location-list/index');
require('../..//pages/login-again/index');
require('../..//pages/regeocoding/index');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
