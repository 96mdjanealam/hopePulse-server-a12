const { ObjectId } = require("mongodb");

/**
 * Parses a string into a MongoDB ObjectId, or returns null if invalid.
 * @param {string} id
 * @returns {ObjectId | null}
 */
function parseObjectId(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  return new ObjectId(id);
}

module.exports = { parseObjectId };
