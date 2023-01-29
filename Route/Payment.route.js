const express = require("express");
const router = express.Router();
const PaymentController = require("../Controller/Payment.Controller");

router.post(
  "/vnpay_create_payment_url",
  PaymentController.createVnPayPaymentURL
);
router.post("/handle-vnpay-response", PaymentController.handleVnPayResponse);

module.exports = router;
