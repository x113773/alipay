var alipayTrans = function() {
	var doTrans = function() {
		var alipayResult = alipayTransAjax.alipay($("#WIDbatch_fee").val(), $("#WIDbatch_num").val(), $("#WIDdetail_data").val());
		if (alipayResult.success) {
			document.write(alipayResult.content);
		}
	}
	
	//查询提现审核列表
	var getAlipayTransData = function(limit, thisPage){
		$.ajax({
			url : "/get-withdraw-apply",
			type : "GET",
			data : {
				limit : limit,
				offset : (thisPage-1)*limit,
			},
			async : false,
			dataType : "json"
		}).done(function(result) {
			pages.init(result.count, limit, thisPage);// 初始化分页
			var applyHtml = '';
			var statusDic = {0: '待处理', 1: '通过', 2: '驳回'};
			for(var i=0; i<result.data.length; i++){
				var remarksClickHtml = 'remarksClick(\''+result.data[i].id+'\', 2)';
				if(result.data[i].status == 0){
					var btnHtml = '<li><a href="javascript:void(0)" onclick="alipayTrans.doTransBtnClick(this)">转账</a>'+
								  '<a href="javascript:void(0)" onclick="remarksClick(\''+result.data[i].id+'\', 2)">驳回</a></li>';
				}else{
					var btnHtml = '';
				}
				applyHtml += '<ul class="list-con">'+
							 '<li class="long-li" id="id">'+result.data[i].id+'</li>'+
							 '<li id="userAccount">'+result.data[i].userAccount+'</li><li id="realName">'+result.data[i].realName+
							 '</li><li id="money">'+result.data[i].money+'</li>'+
							 '<li id="applyTime">'+result.data[i].applyTime+'</li><li id="status">'+statusDic[result.data[i].status]+'</li>'+
							 btnHtml+'</ul>';
			}
			$('#applyList').append(applyHtml);
		});
	};
	
	var doTransBtnClick = function(tag){
		var parentUl = $(tag).parents('ul');
		var money = parentUl.children('#money').html();
		var id = parentUl.children('#id').html();
		var userAccount = parentUl.children('#userAccount').html();
		var realName = parentUl.children('#realName').html();
		
		$('#WIDbatch_fee').val(money);
		var WIDdetailVal = id+'^'+userAccount+'^'+realName+'^'+money+'^ ';
		$('#WIDdetail_data').val(WIDdetailVal);
		$('#WIDbatch_num').val(1);
	};
	
	return {
		doTrans : function() {
			var result = doTrans();
			return result;
		},
		getAlipayTransData:function(limit, thisPage){
			getAlipayTransData(limit, thisPage);
		},
		doTransBtnClick:function(tag){
			doTransBtnClick(tag);
		}
	};
}();

var alipayTransAjax = function() {
	/**
	 * 调用支付宝转账接口
	 */
	var alipay = function(WIDbatch_fee, WIDbatch_num, WIDdetail_data) {
		var result = null;
		$.ajax({
			url : "/coMall/qibi/alipay-trans",
			type : "POST",
			data : {
				"WIDbatch_fee" : WIDbatch_fee,
				"WIDbatch_num" : WIDbatch_num,
				"WIDdetail_data" : WIDdetail_data
			},
			async : false,
			dataType : "json"
		}).done(function(data) {
			result = data;
		});
		return result;
	}

	return {
		alipay : function(WIDbatch_fee, WIDbatch_num, WIDdetail_data) {
			var result = alipay(WIDbatch_fee, WIDbatch_num, WIDdetail_data);
			return result;
		}
	};
}();

var remarksClick = function(id, status){
	pop('添加备注', 
		'<textarea id="remarks" rows="" cols="" placeholder="请输入备注内容" style="width:97%;height:90px;"></textarea>', 
		1, 
		[{
			value:"确定",
			autofocus:true,
			callback:function(){
				var result = updateAlipay(id, status, $('#remarks').val());
				if(result.success == true){
					pop('驳回', '驳回成功。', 1, null, 2500);
					setTimeout(function(){
						location.reload();
					}, 2510);
					
				}else{
					
					pop('驳回', ErrorMessage[result.error], 2, null, 2500);
				}
				
				 
			}
		}, {
			value : "取消",
			callback : function() {
				return;
		}
	}], null);
};
var updateAlipay = function(id, status, remarks){
	var result = null;
	$.ajax({
		url : "/update-withdraw-apply",
		type : "POST",
		data : {
			"id" : id,
			"status" : status,
			"remarks" : remarks
		},
		async : false,
		dataType : "json"
	}).done(function(data) {
		result = data;
	});
	return result;
};

$(function(){
	var thisPage = GetQueryString("page");//获取当前页码
	if(!thisPage){
		thisPage = 1;//第一页给页码默认值
	}
	var limit = 10;
	alipayTrans.getAlipayTransData(limit, thisPage);
})//function