const dns = require("dns");
const { MongoClient, ServerApiVersion } = require("mongodb");
const env = require("./env");

// Local Windows networks sometimes refuse SRV queries; Vercel uses native DNS.
if (!process.env.VERCEL) {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

const uri = `mongodb+srv://${env.dbUser}:${env.dbPass}@cluster0.mqmjq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const DB_NAME = "hopePulse";

let connectPromise = null;

/**
 * Connects to MongoDB (reusing the in-flight/active connection across serverless invocations).
 * @returns {Promise<import("mongodb").Db>}
 */
async function connectDB() {
  if (!connectPromise) {
    connectPromise = client
      .connect()
      .then(() => {
        console.log("Connected to MongoDB!");
      })
      .catch((err) => {
        connectPromise = null;
        throw err;
      });
  }
  await connectPromise;
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
