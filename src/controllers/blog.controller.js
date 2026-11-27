const { getCollections } = require("../config/db");
const { parseObjectId } = require("../utils/objectId");
const { paginateCollection } = require("../utils/pagination");

/**
 * POST /createBlog
 * Creates a new blog post.
 */
async function createBlog(req, res) {
  const { blogCollection } = getCollections();
  const result = await blogCollection.insertOne(req.body);
  res.send(result);
}

/**
 * GET /allBlogs
 * Retrieves all blogs regardless of status (supports optional ?page & ?limit).
 */
async function getAllBlogs(req, res) {
  const { blogCollection } = getCollections();
  const result = await paginateCollection(blogCollection, {}, req.query);
  res.send(result);
}

/**
 * GET /publishedBlogs
 * Retrieves all published blogs (supports optional ?page & ?limit).
 */
async function getPublishedBlogs(req, res) {
  const { blogCollection } = getCollections();
  const result = await paginateCollection(
    blogCollection,
    { status: "published" },
    req.query
  );
  res.send(result);
}

/**
 * PATCH /blog-status-update/:id
 * Updates a blog's status to "draft" or "published".
 */
async function updateBlogStatus(req, res) {
  const objectId = parseObjectId(req.params.id);
  if (!objectId) {
    return res.status(400).send({ message: "Invalid blog ID" });
  }

  const { status } = req.body;
  if (status !== "draft" && status !== "published") {
    return res.status(400).send({ message: "Invalid blog status" });
  }

  const { blogCollection } = getCollections();
  const result = await blogCollection.updateOne(
    { _id: objectId },
    { $set: { status } }
  );
  res.send(result);
}

module.exports = {
  createBlog,
  getAllBlogs,
  getPublishedBlogs,
  updateBlogStatus,
};
