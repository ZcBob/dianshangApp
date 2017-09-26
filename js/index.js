/**
 * 轮播图获取数据
 * */
$(function() {
  shop.api.fetchBanner(function(response) {
    var position_id = response.data[0].position_id;
    shop.api.fetchCarousel(position_id, function(response) {
      console.log(response);
      for (var i = 0; i < response.data.length; i++) {
        var obj = response.data[i];
        var li = `<li class="swiper-slide"><a href=""><img src="${obj.url}"/></a>`;
        $('#carousel-list').append($(li));
      }
      //swiper轮播图
      var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        loop: true,
        autoplayDisableOnInteraction: false,
        autoplay: 3000,
        onInit: function(swiper) {
          swiperAnimateCache(swiper);
          swiperAnimate(swiper);
        },
        onSlideChangeEnd: function(swiper) {
          swiperAnimate(swiper);
        }
      });
    });
  });
});
/**
 * 获取热门商品
 *
 * */
/*
 *8.更新热门商品
 * */
var more = document.getElementById('more'),page = 1;
hotGoods(page); //显示第一页
more.onclick = function () {
  page++;
  console.log(page);
  if(page>102)page=102;
  hotGoods(page);
}
function hotGoods(page) {
  shop.api.fetchHotGoods( page, 12,function (response) {
    var content = "";
    for(var i = 0; i < response.data.length; i++){
      var obj = response.data[i];
      content += `
      <li class="item">
        <a class="oImg" href="pro_center.html?goods_id=${obj.goods_id}">
          <img src="${obj.goods_thumb}"/>
          <h4>${obj.goods_name}</h4>
        </a>
        <span class="price"><em>¥</em>${obj.price}</span>
      </li>
          `
    }
    $('#hot-list').append(content);
  });
}
