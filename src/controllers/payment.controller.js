const { getCollections } = require("../config/db");
const stripe = require("../config/stripe");
const { paginateCollection } = require("../utils/pagination");

/**
 * GET /allFunding
 * Retrieves all funding/payment records (supports optional ?page & ?limit).
 */
async function getAllFunding(req, res) {
  const { paymentCollection } = getCollections();
  const result = await paginateCollection(paymentCollection, {}, req.query);
  res.send(result);
}

/**
 * GET /allFunding10
 * Retrieves the 10 most recent funding/payment records.
 */
async function getRecentFunding(req, res) {
  try {
    const { paymentCollection } = getCollections();
    const allFunding = await paymentCollection
      .find()
      .sort({ _id: -1 })
      .limit(10)
      .toArray();
    res.send(allFunding);
  } catch (error) {
    console.error("Error fetching funding data:", error);
    res.status(500).send("Internal Server Error");
  }
}

/**
 * POST /create-payment-intent
 * Creates a Stripe PaymentIntent for a given donationAmount.
 */
async function createPaymentIntent(req, res) {
  const { donationAmount } = req.body;

  if (typeof donationAmount !== "number" || donationAmount <= 0) {
    return res.status(400).send({ error: "Invalid donation amount" });
  }

  const amount = parseInt(donationAmount * 100, 10);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).send({ error: "Failed to create payment intent" });
  }
}

/**
 * POST /payments
 * Persists a completed payment record.
 */
async function createPayment(req, res) {
  const { paymentCollection } = getCollections();
  const paymentResult = await paymentCollection.insertOne(req.body);
  res.send(paymentResult);
}

module.exports = {
  getAllFunding,
  getRecentFunding,
  createPaymentIntent,
  createPayment,
};
