import express from "express";
import {
  collectEvent,
  getEventSummary,
  getUserStats
} from "../controllers/analyticsController.js";

import { verifyApiKey } from "../middleware/authMiddleware.js";
import { apiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Collect event
router.post("/collect", verifyApiKey, apiLimiter, collectEvent);

// Event summary
router.get("/event-summary", verifyApiKey, apiLimiter, getEventSummary);

// User stats
router.get("/user-stats", verifyApiKey, apiLimiter, getUserStats);

export default router;
