const express = require("express");
const donationRequestController = require("../controllers/donationRequest.controller");
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");
const { asyncHandler } = require("../middlewares/error.middleware");

const router = express.Router();

router.post(
  "/createDonationRequest",
  verifyToken,
  asyncHandler(donationRequestController.createDonationRequest)
);
router.get(
  "/pending-donation-requests",
  asyncHandler(donationRequestController.getPendingDonationRequests)
);
router.get(
  "/donationRequests",
  verifyToken,
  asyncHandler(donationRequestController.getRecentDonationRequests)
);
router.get(
  "/allDonationRequests",
  verifyToken,
  asyncHandler(donationRequestController.getUserDonationRequests)
);
router.get(
  "/allDonationRequestsAd",
  verifyToken,
  asyncHandler(donationRequestController.getAllDonationRequests)
);
router.get(
  "/donationRequest/:id",
  verifyToken,
  asyncHandler(donationRequestController.getDonationRequestById)
);
router.delete(
  "/requestDelete/:id",
  verifyToken,
  verifyAdmin,
  asyncHandler(donationRequestController.deleteDonationRequest)
);
router.patch(
  "/request-status-update/:id",
  verifyToken,
  asyncHandler(donationRequestController.updateDonationRequestStatus)
);
router.patch(
  "/requestUpdate/:id",
  verifyToken,
  asyncHandler(donationRequestController.updateDonationRequest)
);

module.exports = router;
