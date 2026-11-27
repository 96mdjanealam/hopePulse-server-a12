/**
 * Wraps async route handlers so rejected promises forward to Express error middleware.
 * @param {Function} fn
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Handles unmatched routes with a 404 JSON response.
 */
function notFoundHandler(req, res) {
  res.status(404).send({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

/**
 * Global Express error handling middleware.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error("Unhandled error:", err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).send({
    message: err.message || "Internal Server Error",
  });
}

module.exports = {
  asyncHandler,
  notFoundHandler,
  errorHandler,
};
