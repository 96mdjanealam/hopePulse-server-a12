const jwt = require("jsonwebtoken");
const env = require("../config/env");

/**
 * POST /jwt
 * Issues a signed JWT for the provided user payload.
 */
async function createToken(req, res) {
  const user = req.body;
  const token = jwt.sign(user, env.accessTokenSecret, {
    expiresIn: "1h",
  });
  res.send({ token });
}

module.exports = {
  createToken,
};
