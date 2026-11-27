const express = require("express");
const authController = require("../controllers/auth.controller");
const { asyncHandler } = require("../middlewares/error.middleware");

const router = express.Router();

router.post("/jwt", asyncHandler(authController.createToken));

module.exports = router;
