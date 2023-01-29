const { sendResponse } = require("../util/helper");
const CC = require("currency-converter-lt");
const db = require("../db");
const { sendMail } = require("../util/email");
module.exports.createVnPayPaymentURL = async (req, res) => {
  var ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  var tmnCode = process.env.TMNCODE;
  var secretKey = process.env.VNPAY_SECRETKEY;
  var vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  var returnUrl = "http://localhost:3000/vnpay-return";
  var date = new Date();
  var createDate = date.toLocaleString("sv-SE").replace(/[^0-9]/g, "");

  let currencyConverter = new CC({
    from: "USD",
    to: "VND",
    amount: req.body.amount,
  });
  var amount = 0;
  const response = await currencyConverter.convert();
  amount = response;

  var bankCode = req.body.bankCode;
  var order_id = req.body.orderId;
  var orderInfo = req.body.orderDescription;
  var orderType = req.body.orderType;
  var locale = req.body.language;
  if (locale === null || locale === "") {
    locale = "vn";
  }
  var currCode = "VND";
  var vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  // vnp_Params['vnp_Merchant'] = ''
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = order_id;
  vnp_Params["vnp_OrderInfo"] = orderInfo;
  vnp_Params["vnp_OrderType"] = orderType;
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);
  var querystring = require("qs");
  var signData = querystring.stringify(vnp_Params, { encode: false });
  var crypto = require("crypto");
  var hmac = crypto.createHmac("sha512", secretKey);
  var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
  sendResponse(res, "", vnpUrl);
};

module.exports.handleVnPayResponse = (req, res) => {
  var responseCode = req.body.responseCode;
  var orderId = req.body.orderId;
  var htmlBody = req.body.htmlBody;
  var userEmail = req.body.userEmail;
  var products = req.body.products;
  var voucherId = req.body.voucherId;
  var message = "";
  switch (responseCode) {
    case "00":
      sendMail(userEmail, "[HLE Ecommerce] Order successful", htmlBody);
      products.map((item) => {
        var updateStatement = `
        UPDATE characteristics_product
        SET total = total - ${item.quantity}
        WHERE product_id = '${item.product_id}' AND characteristics_hash = '${item.hash}'`;
        db.query(updateStatement, (err, result) => {
          if (err) {
            console.log(err);
          }
        });
      });
      if (voucherId) {
        var deleteStatement = `
        UPDATE voucher 
        SET used = used + 1
        WHERE id = '${voucherId}'
      `;
        db.query(deleteStatement, (err, result) => {
          if (err) {
            console.log(err);
          }
        });
      }
      message = "success";
      break;
    case "07":
      message =
        "Subtract money successfully. Suspected transactions (related to fraud, unusual transactions).";
      break;
    case "09":
      deleteOrders(orderId);
      message =
        "The transaction failed due to: The customer's card/account has not registered for InternetBanking service at the bank.";
      break;
    case "10":
      deleteOrders(orderId);
      message =
        "Transaction failed due to: Customers authenticated incorrect card/account information more than 3 times";
      break;
    case "11":
      deleteOrders(orderId);
      message =
        "The transaction failed due to: Expired pending payment. Please repeat the transaction.";
      break;
    case "12":
      deleteOrders(orderId);
      message =
        "The transaction failed due to: The client's card/account is locked.";
      break;
    case "13":
      deleteOrders(orderId);
      message =
        "The transaction failed because you entered the wrong transaction authentication password (OTP). Please repeat the transaction.";
      break;
    case "24":
      deleteOrders(orderId);
      message =
        "The transaction failed due to: The client canceled the transaction";
      break;
    case "51":
      deleteOrders(orderId);
      message =
        "The transaction failed due to: Your account does not have enough balance to make a transaction.";
      break;
    case "65":
      deleteOrders(orderId);
      message =
        "The transaction failed due to: Your account exceeded the intraday trading limit.";
      break;
    case "75":
      deleteOrders(orderId);
      message = "The payment bank is in maintenance.";
      break;
    case "79":
      deleteOrders(orderId);
      message =
        "The transaction failed due to: The customer entered the wrong payment password more than the specified number of times. Please re-enter the transaction";
      break;
    case "99":
      deleteOrders(orderId);
      message =
        "Other errors (remaining errors, not in the list of listed error codes)";
      break;
    default:
      break;
  }
  sendResponse(res, "", message);
};

function deleteOrders(orderId) {
  const deleteOrderDetailStatement = `
    DELETE 
    FROM orderdetail
    WHERE order_id = '${orderId}'
  `;
  const deleteOrdersStatement = `
    DELETE 
    FROM orders
    WHERE order_id = '${orderId}'
  `;
  db.query(deleteOrderDetailStatement, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      db.query(deleteOrdersStatement, (innerErr, innerResult) => {
        if (innerErr) {
          console.log(innerErr);
        }
      });
    }
  });
}

function sortObject(obj) {
  var sorted = {};
  var str = [];
  var key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}
