const Stripe = require("stripe");
const env = require("./env");

const stripe = new Stripe(env.stripeSecretKey);

module.exports = stripe;
