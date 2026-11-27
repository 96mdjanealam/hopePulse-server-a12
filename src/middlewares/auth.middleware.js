const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { getCollections } = require("../config/db");

/**
 * Verifies the Bearer JWT token from the Authorization header.
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "unauthorized access" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "unauthorized access" });
  }

  jwt.verify(token, env.accessTokenSecret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.decoded = decoded;
    next();
  });
}

/**
 * Ensures the authenticated user has the "Admin" role.
 * Must be used after verifyToken.
 */
async function verifyAdmin(req, res, next) {
  try {
    const email = req.decoded?.email;
    const { usersCollection } = getCollections();
    const user = await usersCollection.findOne({ email });
    const isAdmin = user?.role === "Admin";

    if (!isAdmin) {
      return res.status(403).send({ message: "forbidden access" });
    }
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  verifyToken,
  verifyAdmin,
};
