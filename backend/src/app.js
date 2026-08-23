import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

//routes
app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
