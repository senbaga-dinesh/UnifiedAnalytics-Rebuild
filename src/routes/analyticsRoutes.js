import express from "express";
import {
  collectEvent,
  getEventSummary,
  getUserStats,
} from "../controllers/analyticsController.js";

import { verifyApiKey } from "../middleware/authMiddleware.js";
import { apiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Analytics event tracking APIs
 */

/**
 * @swagger
 * /api/analytics/collect:
 *   post:
 *     tags: [Analytics]
 *     summary: Collect an event
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event: { type: string }
 *               url: { type: string }
 *               device: { type: string }
 *     responses:
 *       201:
 *         description: Event recorded
 */
router.post("/collect", verifyApiKey, apiLimiter, collectEvent);

/**
 * @swagger
 * /api/analytics/event-summary:
 *   get:
 *     tags: [Analytics]
 *     summary: Summary of events
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *       - in: query
 *         name: event
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Event summary returned
 */
router.get("/event-summary", verifyApiKey, apiLimiter, getEventSummary);

/**
 * @swagger
 * /api/analytics/user-stats:
 *   get:
 *     tags: [Analytics]
 *     summary: Analytics per user
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *       - in: query
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User stats returned
 */
router.get("/user-stats", verifyApiKey, apiLimiter, getUserStats);

export default router;
