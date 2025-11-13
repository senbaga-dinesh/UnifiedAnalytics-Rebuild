import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import { sequelize } from "./config/db.js";
import db from "./models/index.js";
import authRoutes from "./routes/authRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

import { swaggerUi, swaggerSpec } from "./docs/swagger.js";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

// Test route
app.get("/", (req, res) => {
  res.send("Unified Analytics API is running…");
});

// DB connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected");
  } catch (err) {
    console.error("PostgreSQL error:", err.message);
  }
})();

// Sync DB
(async () => {
  try {
    await db.sequelize.sync({ alter: true });
    console.log("DB synchronized");
  } catch (err) {
    console.error("Sync error:", err.message);
  }
})();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/analytics", analyticsRoutes);

// Swagger
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// PORT
const PORT = process.env.PORT || 5000;

// Start server (exported for tests)
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
export { server };
