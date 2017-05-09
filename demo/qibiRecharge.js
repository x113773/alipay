/**
 * 充值API
 */
var qibiRecharge = function() {
	/**
	 * 生成充值弹出框
	 */
	var buildQibiRechargeBlock = function() {
		var contentinput = '<div class="pop-mian"><span class="czsl heised">充值金额</span>' + ':<input type="text" class="cznum" id="WIDtotal_fee" autocomplete="off" onkeyup="qibiRecharge.qibiNumOnkeyup(this.id)"/><span class="heised">元</span>'
				+ '<span class="shuom" id="rechargeHint"></span></div><div class="pop-mian">' + '<span class="czsl heised">充值方式</span>:<label for="alipay" class="mar-lfor-pop">'
				+ '<input type="radio" id="alipay" name="" value="" checked="checked"><img src="/dayu/img/coMall/zhifubao.png"/>支付宝支付</label>' + '<div class="pop-mian"><span class="czsl clr-fpop"><img src="/dayu/img/coMall/zhongzhixuzhi.png"/>支付说明</span></div>';
		var btn = [ {
			value : "提交",
			// 绑定提交事件
			callback : function() {
				return qibiRechargeHandler($("#WIDtotal_fee").val());
			}
		}, {
			value : "关闭",
			callback : function() {
				return;
			}
		} ];
		var size = new Object();
		size.width = "400px";
		size.height = "258px";
		pop("充值", contentinput, 1, btn, null, size);

	};
	/**
	 * 充值提交事件
	 */
	var qibiRechargeHandler = function(rmbNum) {
		SecurityApi.getCurrentUser();
		var qibiNumVerify = qibiNumOnkeyup("WIDtotal_fee");
		if(qibiNumVerify){
			var alipayResult = qibiRechargeAjax.alipay(rmbNum);
			if (alipayResult.success) {
				document.write(alipayResult.content);
			}
		}else{
			return false;
		}
	}

	/**
	 * 输入框键盘监听事件
	 */
	var qibiNumOnkeyup = function(id) {
		var rmbNum = $("#" + id).val();
		if (Math.floor(rmbNum) == rmbNum) {//true
				$("#rechargeHint").text(" ");
				return true; 
		}
		$("#rechargeHint").text("请输入大于0的整数");
		$("#rechargeHint").css("color","red");
		return false; 
	}

	return {
		buildQibiRechargeBlock : function() {
			var result = buildQibiRechargeBlock();
			return result;
		},
		qibiNumOnkeyup : function(id) {
			var result = qibiNumOnkeyup(id);
			return result;
		}

	};
}();

/**
 * 充值AJAX
 */
var qibiRechargeAjax = function() {
	/**
	 * 调用支付宝接口
	 */
	var alipay = function(rmbNum) {
		var result = null;
		$.ajax({
			url : "/alipay",
			type : "POST",
			data : {
				"WIDsubject" : "充值"+rmbNum+"元",
				"WIDtotal_fee" : rmbNum,
				"WIDbody" : null
			},
			async : false,
			dataType : "json"
		}).done(function(data) {
			result = data;
		});
		return result;
	}
	/**
	 * 添加记录
	 */
	var addQibiRecord = function(exchange) {
		var result = null;
		$.ajax({
			url : "exchange/topup",
			type : "POST",
			data : exchange,
			async : false,
			dataType : "json"
		}).done(function(data) {
			result = data;
		});
		return result;
	}
	return {
		alipay : function(rmbNum) {
			var result = alipay(rmbNum);
			return result;
		},
		addQibiRecord : function(exchange) {
			var result = addQibiRecord(exchange);
			return result;
		}
	};
}();