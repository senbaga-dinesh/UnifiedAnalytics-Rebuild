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
 *   description: Collect and analyze app events
 */

/**
 * @swagger
 * /api/analytics/collect:
 *   post:
 *     summary: Collect an analytics event
 *     tags: [Analytics]
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [event]
 *             properties:
 *               event:
 *                 type: string
 *                 example: page_view
 *               url:
 *                 type: string
 *               device:
 *                 type: string
 *                 example: mobile
 *     responses:
 *       201:
 *         description: Event collected
 */
router.post("/collect", verifyApiKey, apiLimiter, collectEvent);

/**
 * @swagger
 * /api/analytics/event-summary:
 *   get:
 *     summary: Get analytics summary
 *     tags: [Analytics]
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: event
 *         schema:
 *           type: string
 *           example: page_view
 *     responses:
 *       200:
 *         description: Analytics summary
 */
router.get("/event-summary", verifyApiKey, apiLimiter, getEventSummary);

/**
 * @swagger
 * /api/analytics/user-stats:
 *   get:
 *     summary: Get user-specific analytics
 *     tags: [Analytics]
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User stats returned
 */
router.get("/user-stats", verifyApiKey, apiLimiter, getUserStats);

export default router;
