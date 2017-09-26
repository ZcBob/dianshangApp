//获取查询字段
$.getQueryString = function(name) {
  var search = location.search.substr(1);
  var reg = new RegExp('(&|^)'+name+'=([^&]*)(&|$)');
  var r = search.match(reg);
  if (r === null) return null;
  return decodeURI(r[2]);
};
$.compile = function(templateStr, dictionObj) {
  return templateStr.replace(/\{([a-zA-Z0-9_]+)\}/g, function(match, $1) {
    return dictionObj[$1];
  });
};
window.shop = {
  config: {
    //请求头
    API_PREFIX: "http://h6.duchengjiu.top/shop/",
    PAGESIZE: 10,
    USER_TOKEN: 'token',
    CART_PREFIX: 'cart_',//在本地存储商品ID和对应数量的时候使用
  },
  base: {
    storage: {
      "setItem": function(k, v) {
        return localStorage.setItem(k, v);
      },
      "getItem": function(k) {
        return localStorage.getItem(k);
      }
    },
    business: {
      //获取用户token
      "getToken": function() {
        return shop.base.storage.getItem(shop.config.USER_TOKEN);
      },
      // 保存购物车内的商品,数量
      "saveGoodsInfoOfCart": function(goods_id, number) {
        return shop.base.storage.setItem(shop.config.CART_PREFIX + goods_id, number);
      }
    }
  },
  api: {
    fetchBanner: function(callback) {
      $.get(shop.config.API_PREFIX + 'api_position.php', callback, 'json')
    },

    fetchCarousel: function(position_id, callback) {
      $.get(shop.config.API_PREFIX + 'api_ad.php', "position_id="+position_id, callback, 'json');
    },
    //获取商品分类
    fetchGoodsCategory: function(callback){
      $.get(shop.config.API_PREFIX + 'api_cat.php', callback, 'json');
    },
    //获取商品分类列表
    fetchGoodsListByCatId: function(cat_id, callback){
      $.get(shop.config.API_PREFIX + 'api_goods.php', "cat_id="+cat_id, callback, 'json');
    },
    //获取单个商品详情
    fetchGoodsDetail: function(goods_id, callback) {
      $.get(shop.config.API_PREFIX + 'api_goods.php', "goods_id="+goods_id, callback, 'json');
    },
    //获取热门商品
    fetchHotGoods: function(page,pagesize,callback){
      $.get(shop.config.API_PREFIX + 'api_goods.php?page=' +page+"&pagesize="+pagesize, callback, 'json');
    },
    //搜索商品
    searchGoods: function(opts){
      var data = {};
      data.search_text = opts.search_text;
      data.page = opts.page || 1;
      data.pagesize = opts.pagesize || shop.config.PAGESIZE;
      var callback = opts.callback;

      $.get(shop.config.API_PREFIX + 'api_goods.php', data, callback, 'json');
    },
    //确认用户名是否存在
    checkUsernameUnique: function(username, callback) {
      var data = {
        "status": "check",
        "username": username
      };
      $.post(shop.config.API_PREFIX + 'api_user.php', data, callback, 'json');
    },
    //注册
    register: function(username, password, callback){
      var data = {
        "status": "register",
        "username": username,
        "password": password
      };
      $.post(shop.config.API_PREFIX + 'api_user.php', data, callback, 'json');
    },
    //登录
    login: function(username, password, callback){
      var data = {
        "status": "login",
        "username": username,
        "password": password
      };
      $.post(shop.config.API_PREFIX + 'api_user.php', data, callback, 'json');
    },
    //更新购物车
    updateCart: function(goods_id, number, callback) {
      var data = {
        "goods_id": goods_id,
        "number": number
      }
      $.post(shop.config.API_PREFIX + 'api_cart.php?token='+shop.base.business.getToken(), data, callback, 'json');
    },
    //获取购物车
    fetchCart: function(callback){
      $.get(shop.config.API_PREFIX + 'api_cart.php', "token="+shop.base.business.getToken(), callback, 'json');
    },
    //获取用户地址
    fetchUserAddress: function(callback){
      $.get(shop.config.API_PREFIX + 'api_useraddress.php?token=' + shop.base.business.getToken(), callback, 'json');
    },
    //添加用户地址
    addUserAddress: function(obj,callback){
      $.post(shop.config.API_PREFIX + 'api_useraddress.php?status=add&token=' + shop.base.business.getToken(), obj,callback, 'json');
    },
    //删除用户地址
    delteUserAddress: function(address_id,callback){
      $.get(shop.config.API_PREFIX + 'api_useraddress.php?status=delete&address_id='+address_id
          +'token='+shop.base.business.getToken(),callback,'json')
    },
    // 编辑用户地址
    editUserAddress: function(){},//todo
    //获取订单
    fetchOrder: function(callback){
      $.get(shop.config.API_PREFIX + 'api_order.php?token=' + shop.base.business.getToken(),callback,'json');
    },
    // 增加订单
    addOrder: function(obj,callback){
      $.post(shop.config.API_PREFIX + 'api_order.php?token='+shop.base.business.getToken()
          +'&status=add&debug=1', obj, callback,'json');
    },
    // 取消订单
    cancelOrder: function(obj,callback){
      $.post(shop.config.API_PREFIX + 'api_order.php?token=' + shop.base.business.getToken()
          +'&status=add&debug=1',obj,callback,'json');
    }
  }
};