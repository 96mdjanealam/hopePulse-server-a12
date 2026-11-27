const express = require("express");
const userController = require("../controllers/user.controller");
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");
const { asyncHandler } = require("../middlewares/error.middleware");

const router = express.Router();

router.post("/users", asyncHandler(userController.createUser));
router.get("/user", verifyToken, asyncHandler(userController.getUserByEmail));
router.get(
  "/user/admin/:email",
  verifyToken,
  asyncHandler(userController.checkUserAdmin)
);
router.get("/allUsers", verifyToken, asyncHandler(userController.getAllUsers));
router.patch(
  "/user-update/:id",
  verifyToken,
  asyncHandler(userController.updateUserProfile)
);
router.patch(
  "/user-update/role/:id",
  verifyToken,
  verifyAdmin,
  asyncHandler(userController.updateUserRole)
);
router.patch(
  "/user-update/status/:id",
  verifyToken,
  asyncHandler(userController.updateUserStatus)
);

module.exports = router;
