require("dotenv").config();

const env = {
  port: process.env.PORT || 5000,
  dbUser: process.env.DB_USER,
  dbPass: process.env.DB_PASS,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  nodeEnv: process.env.NODE_ENV || "development",
};

module.exports = env;
