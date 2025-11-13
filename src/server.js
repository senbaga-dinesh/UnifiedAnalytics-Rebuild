import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { sequelize } from "./config/db.js";

// Load .env file
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

// Basic test route
app.get("/", (req, res) => {
  res.send("🚀 Unified Analytics API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connection established");
  } catch (err) {
    console.error("❌ DB connection error:", err.message);
  }
})();


export default app;
