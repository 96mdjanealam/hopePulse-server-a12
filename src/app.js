const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/error.middleware");

const app = express();

// Core middlewares
app.use(cors());
app.use(express.json());

// API routes
app.use("/", routes);

// Error handling middlewares
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
