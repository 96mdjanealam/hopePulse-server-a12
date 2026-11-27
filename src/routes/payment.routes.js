const express = require("express");
const paymentController = require("../controllers/payment.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { asyncHandler } = require("../middlewares/error.middleware");

const router = express.Router();

router.get(
  "/allFunding",
  verifyToken,
  asyncHandler(paymentController.getAllFunding)
);
router.get(
  "/allFunding10",
  verifyToken,
  asyncHandler(paymentController.getRecentFunding)
);
router.post(
  "/create-payment-intent",
  asyncHandler(paymentController.createPaymentIntent)
);
router.post("/payments", asyncHandler(paymentController.createPayment));

module.exports = router;
