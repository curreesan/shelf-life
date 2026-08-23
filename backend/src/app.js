import express from "express";
import cors from "cors";

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

//routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
