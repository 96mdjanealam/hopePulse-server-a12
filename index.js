const env = require("./src/config/env");
const { connectDB } = require("./src/config/db");
const app = require("./src/app");

connectDB().catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
});

if (require.main === module) {
  app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
  });
}

module.exports = app;
