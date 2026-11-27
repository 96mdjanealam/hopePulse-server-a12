const { getCollections } = require("../config/db");
const { parseObjectId } = require("../utils/objectId");
const { paginateCollection } = require("../utils/pagination");

/**
 * POST /createDonationRequest
 * Creates a new blood donation request.
 */
async function createDonationRequest(req, res) {
  const { requestsCollection } = getCollections();
  const result = await requestsCollection.insertOne(req.body);
  res.send(result);
}

/**
 * GET /pending-donation-requests
 * Retrieves all donation requests with status "pending" (supports optional ?page & ?limit).
 */
async function getPendingDonationRequests(req, res) {
  const { requestsCollection } = getCollections();
  const result = await paginateCollection(
    requestsCollection,
    { donationStatus: "pending" },
    req.query
  );
  res.send(result);
}

/**
 * GET /donationRequests?email=...
 * Retrieves the 3 most recent donation requests for a requester.
 */
async function getRecentDonationRequests(req, res) {
  const { requestsCollection } = getCollections();
  const email = req.query.email;
  const userRequests = await requestsCollection
    .find({ requesterEmail: email })
    .sort({ _id: -1 })
    .limit(3)
    .toArray();
  res.send(userRequests);
}

/**
 * GET /allDonationRequests?email=...
 * Retrieves all donation requests for a requester (supports optional ?page & ?limit).
 */
async function getUserDonationRequests(req, res) {
  const { requestsCollection } = getCollections();
  const email = req.query.email;
  const result = await paginateCollection(
    requestsCollection,
    { requesterEmail: email },
    req.query
  );
  res.send(result);
}

/**
 * GET /allDonationRequestsAd
 * Retrieves all donation requests across all users (supports optional ?page & ?limit).
 */
async function getAllDonationRequests(req, res) {
  const { requestsCollection } = getCollections();
  const result = await paginateCollection(requestsCollection, {}, req.query);
  res.send(result);
}

/**
 * GET /donationRequest/:id
 * Retrieves a single donation request by ID.
 */
async function getDonationRequestById(req, res) {
  const objectId = parseObjectId(req.params.id);
  if (!objectId) {
    return res.status(400).send({ message: "Invalid donation request ID" });
  }

  const { requestsCollection } = getCollections();
  const result = await requestsCollection.findOne({ _id: objectId });
  res.send(result);
}

/**
 * DELETE /requestDelete/:id
 * Deletes a donation request by ID (Admin only).
 */
async function deleteDonationRequest(req, res) {
  const objectId = parseObjectId(req.params.id);
  if (!objectId) {
    return res.status(400).send({ message: "Invalid donation request ID" });
  }

  const { requestsCollection } = getCollections();
  const result = await requestsCollection.deleteOne({ _id: objectId });
  res.send(result);
}

/**
 * PATCH /request-status-update/:id
 * Updates a donation request's status (canceled, done, or inprogress with donor info).
 */
async function updateDonationRequestStatus(req, res) {
  const objectId = parseObjectId(req.params.id);
  if (!objectId) {
    return res.status(400).send({ message: "Invalid donation request ID" });
  }

  const { status, donorName, donorEmail } = req.body;
  const { requestsCollection } = getCollections();

  if (status === "canceled" || status === "done") {
    const result = await requestsCollection.updateOne(
      { _id: objectId },
      { $set: { donationStatus: status } }
    );
    return res.send(result);
  }

  if (status === "inprogress") {
    const result = await requestsCollection.updateOne(
      { _id: objectId },
      { $set: { donationStatus: status, donorName, donorEmail } }
    );
    return res.send(result);
  }

  return res.status(400).send({ message: "Invalid donation status" });
}

/**
 * PATCH /requestUpdate/:id
 * Updates editable fields of a donation request.
 */
async function updateDonationRequest(req, res) {
  const objectId = parseObjectId(req.params.id);
  if (!objectId) {
    return res.status(400).send({ message: "Invalid donation request ID" });
  }

  const { requestsCollection } = getCollections();
  const updateDoc = {
    $set: {
      bloodGroup: req.body.bloodGroup,
      date: req.body.date,
      district: req.body.district,
      fullAddress: req.body.fullAddress,
      hospital: req.body.hospital,
      message: req.body.message,
      recipientName: req.body.recipientName,
      time: req.body.time,
      upazilla: req.body.upazilla,
    },
  };

  const result = await requestsCollection.updateOne({ _id: objectId }, updateDoc);
  res.send(result);
}

module.exports = {
  createDonationRequest,
  getPendingDonationRequests,
  getRecentDonationRequests,
  getUserDonationRequests,
  getAllDonationRequests,
  getDonationRequestById,
  deleteDonationRequest,
  updateDonationRequestStatus,
  updateDonationRequest,
};
