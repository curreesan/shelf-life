import "dotenv/config";
import cron from "node-cron";
import connectDB from "./config/db.js";
import app from "./app.js";
import { runExpiryDigest } from "./jobs/expiryDigest.js";

const PORT = process.env.PORT || 5001;

const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
  });

  cron.schedule("0 8 * * *", () => {
    runExpiryDigest().catch((err) =>
      console.error(`Expiry Digest Job Error : ${err}`)
    );
  });
};

start();
