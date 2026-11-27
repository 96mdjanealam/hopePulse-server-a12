const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const routes = require("./routes");
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/error.middleware");

const app = express();

// Core middlewares
app.use(cors());
app.use(express.json());

// Ensure MongoDB is connected before handling API requests (important on serverless cold starts)
app.use(async (req, res, next) => {
  if (req.path === "/") {
    return next();
  }
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// API routes
app.use("/", routes);

// Error handling middlewares
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
