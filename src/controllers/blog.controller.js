const { getCollections } = require("../config/db");
const { parseObjectId } = require("../utils/objectId");

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
 * Retrieves all blogs regardless of status.
 */
async function getAllBlogs(req, res) {
  const { blogCollection } = getCollections();
  const allBlogs = await blogCollection.find().toArray();
  res.send(allBlogs);
}

/**
 * GET /publishedBlogs
 * Retrieves all published blogs.
 */
async function getPublishedBlogs(req, res) {
  const { blogCollection } = getCollections();
  const publishedBlogs = await blogCollection
    .find({ status: "published" })
    .toArray();
  res.send(publishedBlogs);
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
