import express from "express";
import {
  collectEvent,
  getEventSummary
} from "../controllers/analyticsController.js";

import { verifyApiKey } from "../middleware/authMiddleware.js";

const router = express.Router();

// Collect event
router.post("/collect", verifyApiKey, collectEvent);

// Event summary (DB based)
router.get("/event-summary", verifyApiKey, getEventSummary);

// Placeholder (we will implement next)
router.get("/user-stats", verifyApiKey, (req, res) =>
  res.status(501).json({ message: "Not implemented yet" })
);

export default router;
