

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;


import me.ansel.alipay.AlipayConfig;
import me.ansel.alipay.AlipaySubmit;



@RestController
public class ExchangeController {
	@Autowired
	private ExchangeService exchangeService;


	/**
	 * 支付宝即时到账交易
	 * 
	 * @param WIDsubject
	 * @param WIDtotal_fee
	 * @param WIDbody
	 * @return Map<String,Object>
	 * @author ansel
	 * @date 2016年9月1日 下午1:30:42
	 */
	@RequestMapping(value = "/alipay", method = RequestMethod.POST)
	public Map<String, Object> alipay(String WIDsubject, String WIDtotal_fee, String WIDbody) {
		Map<String, String> sParaTemp = new HashMap<String, String>();
		sParaTemp.put("service", AlipayConfig.service);
		sParaTemp.put("partner", AlipayConfig.partner);
		sParaTemp.put("seller_id", AlipayConfig.seller_id);
		sParaTemp.put("_input_charset", AlipayConfig.input_charset);
		sParaTemp.put("payment_type", AlipayConfig.payment_type);
		sParaTemp.put("notify_url", AlipayConfig.notify_url);
		sParaTemp.put("return_url", AlipayConfig.return_url);
		sParaTemp.put("anti_phishing_key", AlipayConfig.anti_phishing_key);
		sParaTemp.put("exter_invoke_ip", AlipayConfig.exter_invoke_ip);
		sParaTemp.put("out_trade_no", UuidHelper.getUuid());
		sParaTemp.put("subject", WIDsubject);
		sParaTemp.put("total_fee", WIDtotal_fee);
		sParaTemp.put("body", WIDbody);
		String sHtmlText = AlipaySubmit.buildRequest(sParaTemp, "get", "确认");
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("success", true);
		result.put("content", sHtmlText);
		return result;
	}
	/**
	 * 支付宝批量付款到支付宝账户
	 * 
	 */

	@RequestMapping(value = "/alipay-trans", method = RequestMethod.POST)
	public Map<String, Object> alipayTrans(String WIDbatch_fee, String WIDbatch_num, String WIDdetail_data) {
		Map<String, String> sParaTemp = new HashMap<String, String>();
		sParaTemp.put("service", "batch_trans_notify");
		sParaTemp.put("partner", AlipayConfig.partner);
		sParaTemp.put("_input_charset", AlipayConfig.input_charset);
		sParaTemp.put("notify_url", AlipayConfig.trans_notify_url);
		sParaTemp.put("email", "email@email.com");
		sParaTemp.put("account_name", "**有限公司");
		Date currentTime = new Date();
		SimpleDateFormat dformatter = new SimpleDateFormat("yyyyMMdd");
		sParaTemp.put("pay_date", dformatter.format(currentTime));
		SimpleDateFormat dtformatter = new SimpleDateFormat("yyyyMMddHHmmss");
		sParaTemp.put("batch_no", dtformatter.format(currentTime));
		sParaTemp.put("batch_fee", WIDbatch_fee);
		sParaTemp.put("batch_num", WIDbatch_num);
		sParaTemp.put("detail_data", WIDdetail_data);
		String sHtmlText = AlipaySubmit.buildRequest(sParaTemp, "get", "确认");
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("success", true);
		result.put("content", sHtmlText);
		return result;
	}
}
