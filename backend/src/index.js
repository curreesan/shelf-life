import "dotenv/config";
import connectDB from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 5001;

const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
  });
};

start();
