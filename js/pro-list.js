var navisopen = false;
$('#btn').click(function(event) {
	event.stopPropagation();
	if (navisopen) {
		$(this).removeClass('active');
		$('.t-nav').removeClass('active');
	} else{
		$(this).addClass('active');
		$('.t-nav').addClass('active');
	}
	navisopen = !navisopen
})

//搜索
$('#search').focus(function() {
	$('.user').hide();
	$('.main-box').hide();
	$('.search-btn').show();
});
$('#search').focusout(function() {
	$('.user').show();
	$('.main-box').show();
	$('.search-btn').hide();
});
 console.log($("#search").val())  
$('#searchBtn')[0].addEventListener('touchstart', function() {
	if (/^\s+$/g.test($("#search").val()) || $("#search").val() === "") {
		 return;
	} else{
		location.href = 'search.html?search_text=' + $("#search").val();
	}
},false)


//获取列表
$(function() {
	shop.api.fetchGoodsCategory(function(response) {
		for (var i = 0; i < response.data.length; i++) {
			var obj = response.data[i];
			$('#leftListBox ul').append(`<li cat_name="${obj.cat_name}" date-cat_id="${obj.cat_id}">${obj.cat_name}</li>`)
			
		}
		var $li = $('#leftListBox ul li');
		var cat_id = $li[0].getAttribute("date-cat_id");
		shop.api.fetchGoodsListByCatId(cat_id, function(response) {
					  console.log(response);  
					  if (response.data.length === 0) {
					  	$(".right-over").html('<li class="hint">后端跑了，没人做数据了，当前分类下面没有商品~ ~ ！^_^  </li>')
					    return;
					  }
					  var content = '';
					  for (var i = 0; i < response.data.length; i++) {
				      var obj = response.data[i];
					  content +=`<li>
					             <a href="pro_center.html?goods_id=${obj.goods_id}">
					             <img src="${obj.goods_thumb}"/>
					             <div class="content">
					             <span>￥${obj.price}</span>
					             <h4>${obj.goods_name}</h4>
					             </div>
					             </a>
					             </li>`;
					  }
					   $(".right-over").html(content);

				})
		for (var j = 0; j < $li.length; j++) {
			$li[0].className = "cur";
			$li[j].addEventListener('touchstart', function(event){
				 event.stopPropagation();
				 $li.removeClass('cur');
				 this.className = "cur";
				 var cat_id = this.getAttribute("date-cat_id");
				 console.log(cat_id)
				 shop.api.fetchGoodsListByCatId(cat_id, function(response) {
					  console.log(response);  
					  if (response.data.length === 0) {
					  	$(".right-over").html('<li class="hint">后端跑了，没人做数据了，当前分类下面没有商品~ ~ ！^_^  </li>')
					    return;
					  }
					  var html = "";
					  for (var i = 0; i < response.data.length; i++) {
				      var obj = response.data[i];
					  html +=`<li><a href="pro_center.html?goods_id=${obj.goods_id}"><img src="${obj.goods_thumb}"/><div class="content"><span>￥${obj.price}</span><h4>${obj.goods_name}</h4></div></a></li>`;
					  }
					   $(".right-over").html(html);

				})
			},false);
		} 
	});
})

//给right-over加上滑动事件
var deltaY;
var nowY = 0;
console.log($('.right-over'))
$('.right-over')[0].addEventListener('touchstart', function(event) {
	deltaY = event.touches[0].clientY - nowY;
}, false);

$('.right-over')[0].addEventListener('touchmove', function(event) {
	event.preventDefault();
	nowY = event.touches[0].clientY - deltaY;
	var ulHeight = this.clientHeight;
	var boxHeight = $('.right-list-box')[0].clientHeight;
	var soustraire = boxHeight - ulHeight;	
	if (nowY > 0) {
		nowY = 0;
	}
	if (nowY < soustraire ) {
		nowY = soustraire;
	}
	this.style.transform = "translateY("+ nowY +"px)";
	this.style.webkitTransform = "translateY("+ nowY +"px)";
	
}, false);

$('.right-over')[0].addEventListener('touchend', function(event) {
    
},false)