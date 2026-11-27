const { getCollections } = require("../config/db");
const { parseObjectId } = require("../utils/objectId");
const { paginateCollection } = require("../utils/pagination");

/**
 * POST /users
 * Creates a new user if the email does not already exist.
 */
async function createUser(req, res) {
  const { usersCollection } = getCollections();
  const user = req.body;
  const existingUser = await usersCollection.findOne({ email: user.email });

  if (existingUser) {
    return res.send({ message: "user already exists", insertedId: null });
  }

  const result = await usersCollection.insertOne(user);
  res.send(result);
}

/**
 * GET /user?email=...
 * Retrieves a single user by email.
 */
async function getUserByEmail(req, res) {
  const { usersCollection } = getCollections();
  const email = req.query.email;
  const user = await usersCollection.findOne({ email });
  res.send(user);
}

/**
 * GET /user/admin/:email
 * Checks whether the specified user has the Admin role.
 */
async function checkUserAdmin(req, res) {
  const email = req.params.email;
  if (email !== req.decoded.email) {
    return res.status(403).send({ message: "forbidden access" });
  }

  const { usersCollection } = getCollections();
  const user = await usersCollection.findOne({ email });
  const admin = user ? user?.role === "Admin" : false;
  res.send({ admin });
}

/**
 * GET /allUsers
 * Retrieves all users (supports optional ?page & ?limit pagination).
 */
async function getAllUsers(req, res) {
  const { usersCollection } = getCollections();
  const result = await paginateCollection(usersCollection, {}, req.query);
  res.send(result);
}

/**
 * PATCH /user-update/:id
 * Updates a user's profile fields.
 */
async function updateUserProfile(req, res) {
  const objectId = parseObjectId(req.params.id);
  if (!objectId) {
    return res.status(400).send({ message: "Invalid user ID" });
  }

  const { usersCollection } = getCollections();
  const updateDoc = {
    $set: {
      name: req.body.name,
      bloodGroup: req.body.bloodGroup,
      district: req.body.district,
      upazilla: req.body.upazilla,
      image: req.body.image,
    },
  };

  const result = await usersCollection.updateOne({ _id: objectId }, updateDoc);
  res.send(result);
}

/**
 * PATCH /user-update/role/:id
 * Updates a user's role (Admin only).
 */
async function updateUserRole(req, res) {
  const objectId = parseObjectId(req.params.id);
  if (!objectId) {
    return res.status(400).send({ message: "Invalid user ID" });
  }

  const { usersCollection } = getCollections();
  const updateDoc = {
    $set: {
      role: req.body.role,
    },
  };

  const result = await usersCollection.updateOne({ _id: objectId }, updateDoc);
  res.send(result);
}

/**
 * PATCH /user-update/status/:id
 * Updates a user's status.
 */
async function updateUserStatus(req, res) {
  const objectId = parseObjectId(req.params.id);
  if (!objectId) {
    return res.status(400).send({ message: "Invalid user ID" });
  }

  const { usersCollection } = getCollections();
  const updateDoc = {
    $set: {
      status: req.body.status,
    },
  };

  const result = await usersCollection.updateOne({ _id: objectId }, updateDoc);
  res.send(result);
}

module.exports = {
  createUser,
  getUserByEmail,
  checkUserAdmin,
  getAllUsers,
  updateUserProfile,
  updateUserRole,
  updateUserStatus,
};
