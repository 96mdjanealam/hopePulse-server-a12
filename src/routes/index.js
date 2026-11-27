const express = require("express");
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const donationRequestRoutes = require("./donationRequest.routes");
const blogRoutes = require("./blog.routes");
const paymentRoutes = require("./payment.routes");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("HopePulse server is running");
});

router.use("/", authRoutes);
router.use("/", userRoutes);
router.use("/", donationRequestRoutes);
router.use("/", blogRoutes);
router.use("/", paymentRoutes);

module.exports = router;
