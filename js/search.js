
//搜索
$('#search').focus(function() {
	$('.user').hide();
	$('#j_list').hide();
	$('.search-btn').show();
});
$('#search').focusout(function() {
	$('.user').show();
	$('#j_list').show();
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

var searchText = $.getQueryString('search_text');
var oSearchText = document.getElementById("searchBtn");
oSearchText.value = searchText;
searchGoods();

function searchGoods () {
	var opts = {
		search_text: searchText,
		callback: function(response) {
			console.log(response);
		    var content = "";
		    for (var i = 0; i < response.data.length; i++) {
		    var obj = response.data[i];
		    content += `
		        <div class= "sea-list">
		            <a href="pro_center.html?goods_id=${obj.goods_id}" class="con">
			            <div class="img"> 
				            <img src="${obj.goods_thumb}" />
				        </div>
			            <p class="name">${obj.goods_name}</p>
			            <div class="info">
			                <em>￥${obj.price}</em>
			            </div>
		            </a>
	                
		        </div>`;
		      }
			$('#j_list').html(content);
		}	
	};
	shop.api.searchGoods(opts);
}