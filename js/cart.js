$(function() {
  shop.api.fetchCart(function(response) {
    console.log(response);
    if (response.code === 1) {
    	 $('#good-list').html('<div><p>你的购物车没有东西，快去选购心爱的商品吧</p><a href="pro_list.html"></a></div>');
    	 return;
    }
    if (response.data.length > 0 ) {
      for (var i = 0; i < response.data.length; i++) {
        var obj = response.data[i];
        obj.subtotal = parseInt(obj.goods_price) * parseInt(obj.goods_number);
        var content = `
      <div class="good-item" data-id="${obj.goods_id}">
	      <span class="txtl">
	        <input type="checkbox" class="chkbox" checked="true">
	      </span>
	      <div class="imgW">
          <img src="${obj.goods_thumb}" />
	      </div>
	      
	      <div class="cnt">
	        <div class="title">
		        <p>${obj.goods_name}</p>
		      </div>
	        <div class="info">
	          <div class="goods_price">¥  ${obj.goods_price}</div>
	          <span class="chiffre">×${obj.goods_number} </span>
	          <div class="rediger"> </div>
	          <div class="count">
	            <div class="count-box">
		            <span class="operate minus"  id="minus-${obj.goods_id}"></span>
		            <input type="text" value="${obj.goods_number}" class="goods_number"/>
		            <span class="operate plus" id="plus-${obj.goods_id}"></span>
	            </div>
	            <span class="remove">删除</span>
	            <div class="finir">完成</div>
	          </div>
	        </div>
	      </div>
	    </div>`;
        $('.good-list').append($(content));
      };
         showSum();
    }
//  事件委托
    $('#good-list').click(function(event) {
    	// console.log("编辑");
    	// this.bgColor = 'red';
    	 //编辑事件
    	if (event.target.className === 'rediger') {
    		var oCount = event.target.nextSibling.nextSibling;
			  oCount.style = "display:block";
    	}
    	// 增加商品
    	if (event.target.className === 'operate plus') {
    		console.log("++");
    		var oNumber = $(event.target).prev();
    		var number = oNumber.val();
    		if (number < 10) {
    			 oNumber.val(++number);
    		}
    	}
    	//减少商品
    	if (event.target.className === 'operate minus') {
    		console.log("--");
    		var oNumber = $(event.target).next();
    		var number = oNumber.val();
    		if (number > 1) {
    			 oNumber.val(--number);
    		}
    	}
    	//删除商品
    	remove();
    	function remove() {
    		if (event.target.className === 'remove' || number === 0) {
	    		console.log('准备删除商品');
	    		$('.f_mask').show();
	    		$('.confirmerRemove').show();
	    		//取消删除
	    		$('#m_cancel').click(function() {
           	$('.f_mask').hide();
    				$('.confirmerRemove').hide();	    			
	    		});
	    		//确定删除
	    		$('#m_ok').click(function() {
	    			$('.f_mask').hide();
    				$('.confirmerRemove').hide();	
		        var goodItem = $(event.target).parent().parent().parent().parent()
		        goodItem[0].parentNode.removeChild(goodItem[0]);
		        var goods_id = $(goodItem).attr('data-id');
		        localStorage.removeItem('cart_' + goods_id);
		        shop.api.updateCart(goods_id, 0, function(response){
		            console.log(response);
		        });
    				showSum(); 
		       });
	    	}
    	}
    	//判断是否选中
    	if (event.target.type === 'checkbox') {
    		showSum();
    		checkSelectAll();
    	}
    	
    	//编辑完成，更新数据
    	
    	if (event.target.className === 'finir') {
    		console.log("编辑完成，更新数据");
    		var goods_id = $(event.target).parent().parent().parent().parent().attr('data-id');
    		console.log(goods_id);
    		var oNumber = $(event.target).prev().prev().children('.goods_number');
    		var number = parseInt(oNumber.val());
    		isNaN(number) ? number = 0 : number;
    		
    		shop.api.updateCart(goods_id, number, function(response){
            console.log(response);
            $(event.target).parent().hide();
						$(event.target).parent().prev().prev().text("×"+number);
            showSum(number);
    		});
        
        return;
    	}
    	
    });
    var str = 1;
    $('#opter').click(function() {
    	if (str === 1) {
		 	  if ($('#opter').prop('checked', false)) {
		 	  	$('#good-list input:checkbox').filter('[type="checkbox"]').prop('checked', false);
	    	 	  showSum();
		 	  }
		 	  str = 2;
		 	  return;
    	}
    	if (str === 2) {
    		if ($('#opter').prop('checked', true)) {
		 	  	$('#good-list input:checkbox').filter('[type="checkbox"]').prop('checked', true);
		 	    showSum();
		 	  }
    		str = 1;
    	}
    	 	  
	 	  
    	 		
    });
    //检查全选状态
    function checkSelectAll() {
    	var goods_count = $('#good-list input:checkbox').filter('[type="checkbox"]').length;
    	var checked_count = $('input:checkbox').filter('[class="chkbox"]').filter(":checked").length;
    	if ( checked_count !== goods_count ) {
    		 $('#opter').prop('checked', false);
    	} else{
    		 $('#opter').prop('checked', true);
    	}
    };
    
    //显示总价
    function showSum(number) {
		var goods = $('#good-list .good-item');
			var sum = 0;
			
			for (var i = 0; i < goods.length; i++) {
				if ( $(goods).eq(i).children('span').children("input").is(':checked') ) {
					var good = goods[i];
					sum += parseFloat( $(good).children(".cnt").children(".info").children(".goods_price").text().substring(1) *  $(good).children(".cnt").children(".info").children(".chiffre").text().substring(1) );
					
				}
			}
			checkSelectAll();
			$('.totalW .total').text("总价 ：￥"+sum);
			
			// 结算 ，发送订单
		  $('.submit').click(function() {
		  	 console.log(sum)
         var subtotal = 
		  	 shop.base.storage.setItem("total",sum);
		  	 location.href="checkout.html";
		  });
		}
    
  });
});





