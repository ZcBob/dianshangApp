/**
 * 点击添加地址页
 * */
$('.selcted-address').click(function () {
  $('.page-order').css({"display":"none"});
   $('.page-address').css({"display":"block","top":"0","left":"0","transition":"all 0.5s linear"});
});
/**
 * 点击返回上一页
 * */
$('#back').click(function () {
  // console.log('a');
  $('.page-address').css({"display":"none"});
  $('.page-order').css({"display":"block","top":"0","left":"0","transition":"all 0.5s linear"});
});

$('.page-newadd .back').click(function () {
  $('.page-newadd').css({"display":"none"});
  $('.page-address').css({"display":"block","top":"0","left":"0","transition":"all 0.5s linear"});
});
/**
 * 前往新增地址页
 * */
$('.addBtn').click(function () {
  $('.page-address').css({"display":"none"});
  $('.page-newadd').css({"display":"block","top":"0","left":"0","transition":"all 0.5s linear"});
});

/**
 * 取得地址信息
 * */
updateUserAddress();
function updateUserAddress() {
  shop.api.fetchUserAddress(function (response) {
    console.log(response);
    var str = '';
    for(var i=0; i<response.data.length; i++){
      var obj = response.data[i];
    str += `
      <ul>
        <li class="item" address-id="${obj.address_id}">
          <p>
            <span class=""><input type="checkbox" class="check-box"></span>
            <span class="p_item">${obj.consignee} ${obj.mobile}</span><br>
            <span class="p_address">${obj.province} ${obj.city} ${obj.address}</span>
          </p>
          <dl>
            <dt class="edit-addr"><i>编辑</i></dt>
            <dd class="del-addr"><i>删除</i></dd>
          </dl>
        </li>
      </ul>
    `;
  }
  $('.add-list').html(str);
    delAddr();
    chooseAddr();
  });

}
/**
 * 添加用户地址
 * */
$('.save-button').click(function () {
  var _consignee = $('.consignee  input').val();
  var _mobile = $('.mobile  input').val();
  var _province = $('.province  input').val();
  var _city = $('.city  input').val();
  var _address = $('.address  input').val();
  var _zip_code = $('.zip_code  input').val();
  console.log(_consignee,_mobile,_province,_city,_address,_zip_code);
  shop.api.addUserAddress({
    consignee: _consignee,
    mobile: _mobile,
    province: _province,
    city: _city,
    address: _address,
    zip_code: _zip_code
  },function () {
    $('.page-address').css({"display":"block","top":"0","left":"0","transition":"all 0.5s linear"});
    $('.page-newadd').css({"display":"none"});
    updateUserAddress();
  })
});
/**
 * 删除用户地址
 * */
function delAddr() {
  $('.del-addr').click(function (event) {
    var _item = event.target.parentNode.parentNode.parentNode;
    var _addressId = _item.getAttribute('address-id');
    _item.parentNode.removeChild(_item);
    shop.api.delteUserAddress(_addressId,function () {
      console.log('删除用户地址成功!');
    });
  });
}

/**
 * 选择收货地址
 * */
function chooseAddr() {
  var checkBox = $('.check-box');
  for(var i=0; i<checkBox.length; i++) {
    checkBox.eq(i).click(function () {
      for (var j = 0; j < checkBox.length; j++) {
        checkBox.eq(j).prop("checked",false);
      }
      this.checked = true;
      var obj = this.parentNode.parentNode.parentNode;
      var _p_item = obj.getElementsByClassName('p_item')[0].innerHTML;
      var _p_address = obj.getElementsByClassName('p_address')[0].innerHTML;
      var _addrID = obj.getAttribute('address-id')
      shop.base.storage.setItem("address-id",_addrID);
      var content = `
           <span>${_p_item}</span>
           <span>${_p_address}</span>
        `;
      $('.selcted-address').html(content);

      $('.page-order').css({"display":"block","top":"0","left":"0","transition":"all 0.5s linear"});
      $('.page-address').css({"display":"none"});
    })
  }
}
/**
 * 查看购物车
 * */
cartList();
function cartList() {
  shop.api.fetchCart(function (response) {
    console.log(response);
    var _total = shop.base.storage.getItem("total");
    var goodsNum = `
          <h4 class="h-title">订单</h4>
          <p>
            <span class="goods-numbers">共${response.data.length}件</span>
            <span class="subtotal">小计:<em> ￥${_total} </em>( 免运费 )</span>
          </p>
      `;


    $('#orderList .order-hd').html(goodsNum);
    var content = '';
    for(var i=0; i<response.data.length; i++){
      var obj = response.data[i];
      content += `
          <li class="item">
            <div class="order-info">
              <div class="imgW">
                <img src="${obj.goods_thumb}">
              </div>
              <div class="proW">
                <p class="goods-name">${obj.goods_name}</p>
                <p class="priceW"><span class="price">￥${obj.goods_price}</span><span class="num">x ${obj.goods_number}</span></p>
              </div>
            </div>
          </li>
        `;
    }
    $('#orderList ul').html(content);
    $('.realPay span em').append('￥'+ _total);
    if(response.data.length == 0){
      $('#orderList ul').html(`<li style="text-align: center;padding-top: 4rem;"><span>购物车中没有商品!</span></li>`);
      return
    }
  })
}
/**
 * 提交订单
 * */
$('.submit').click(function () {
  var addressId = shop.base.storage.getItem("address-id");
  var total = shop.base.storage.getItem("total");
  shop.api.addOrder({
    "address_id": addressId,
    "total_prices": total
  },function (response) {
    console.log(response);
      if(response.code == 2002)return;
      shop.base.storage.setItem("total",0);
      $('.add-success').show(0).delay(2500).hide(0);
      // location.href = "/suyi/moi-shop/";
      location.reload();
  });
});
