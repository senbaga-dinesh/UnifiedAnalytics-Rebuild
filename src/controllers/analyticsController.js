// src/controllers/analyticsController.js
import db from "../models/index.js";
import { redisClient } from "../config/redis.js";

const Event = db.Event;

/**
 * POST /api/analytics/collect
 * - Requires req.apiKeyInfo to be attached by auth middleware (verifyApiKey)
 * - Validates required fields, inserts event into DB
 * - Invalidates related cached summaries in Redis (if Redis is connected)
 */
export const collectEvent = async (req, res) => {
  try {
    const { event, url, referrer, device, userId, ipAddress, metadata } = req.body;

    if (!event || typeof event !== "string" || event.trim() === "") {
      return res.status(400).json({ message: "Event name is required" });
    }

    // Ensure middleware attached apiKeyInfo
    if (!req.apiKeyInfo || !req.apiKeyInfo.apiKey) {
      return res.status(401).json({ message: "API key information missing" });
    }

    const apiKeyValue = req.apiKeyInfo.apiKey;

    // Create the event record
    const newEvent = await Event.create({
      apiKey: apiKeyValue,
      userId: userId || null,
      event: event.trim(),
      url: url || null,
      referrer: referrer || null,
      device: device || null,
      ipAddress: ipAddress || req.ip || null,
      metadata: metadata || null,
    });

    // Invalidate cache for this API key (summary cache)
    // Keys used elsewhere: event-summary:<apiKey>:all and event-summary:<apiKey>:<eventName>
    try {
      const cacheKeyAll = `event-summary:${apiKeyValue}:all`;
      const cacheKeySpecific = `event-summary:${apiKeyValue}:${event.trim()}`;
      if (redisClient && typeof redisClient.del === "function") {
        // del returns number of keys removed; we don't need the result
        await redisClient.del(cacheKeyAll, cacheKeySpecific);
      }
    } catch (redisErr) {
      // Non-fatal — log and continue (do not fail the request)
      console.error("⚠️ Redis cache invalidate failed:", redisErr.message || redisErr);
    }

    return res.status(201).json({
      message: "Event collected successfully",
      id: newEvent.id,
    });
  } catch (err) {
    console.error("Error in collectEvent:", err);
    return res.status(500).json({
      message: "Error collecting event",
      error: err.message || "unknown error",
    });
  }
};
