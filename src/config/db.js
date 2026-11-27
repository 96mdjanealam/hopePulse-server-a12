const dns = require("dns");
const { MongoClient, ServerApiVersion } = require("mongodb");
const env = require("./env");

// Fallback to public DNS servers so mongodb+srv:// SRV lookups succeed on networks whose local DNS refuses SRV queries
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const uri = `mongodb+srv://${env.dbUser}:${env.dbPass}@cluster0.mqmjq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const DB_NAME = "hopePulse";

let isConnected = false;

/**
 * Connects to MongoDB if not already connected.
 * @returns {Promise<import("mongodb").Db>}
 */
async function connectDB() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  return client.db(DB_NAME);
}

/**
 * Returns the initialized MongoDB database instance.
 * @returns {import("mongodb").Db}
 */
function getDB() {
  return client.db(DB_NAME);
}

/**
 * Returns typed collection handles used across the application.
 */
function getCollections() {
  const db = getDB();
  return {
    usersCollection: db.collection("users"),
    requestsCollection: db.collection("DonationRequests"),
    blogCollection: db.collection("blogs"),
    paymentCollection: db.collection("payments"),
  };
}

module.exports = {
  client,
  connectDB,
  getDB,
  getCollections,
};
