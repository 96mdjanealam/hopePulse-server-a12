const express = require("express");
const blogController = require("../controllers/blog.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { asyncHandler } = require("../middlewares/error.middleware");

const router = express.Router();

router.post("/createBlog", verifyToken, asyncHandler(blogController.createBlog));
router.get("/allBlogs", verifyToken, asyncHandler(blogController.getAllBlogs));
router.get("/publishedBlogs", asyncHandler(blogController.getPublishedBlogs));
router.patch(
  "/blog-status-update/:id",
  verifyToken,
  asyncHandler(blogController.updateBlogStatus)
);

module.exports = router;
