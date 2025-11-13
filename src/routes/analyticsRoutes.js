// src/routes/analyticsRoutes.js

import express from "express";
import {
  collectEvent,
  // getEventSummary, getUserStats   // implemented later
} from "../controllers/analyticsController.js";

import { verifyApiKey } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * POST /api/analytics/collect
 * Protected by API key middleware (verifyApiKey)
 */
router.post("/collect", verifyApiKey, collectEvent);

/**
 * placeholder routes (will be implemented next steps)
 */
router.get("/event-summary", verifyApiKey, (req, res) =>
  res.status(501).json({ message: "Not implemented yet" })
);

router.get("/user-stats", verifyApiKey, (req, res) =>
  res.status(501).json({ message: "Not implemented yet" })
);

export default router;
