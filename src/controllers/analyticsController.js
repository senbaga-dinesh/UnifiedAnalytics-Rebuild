import db from "../models/index.js";
import { redisClient } from "../config/redis.js";

const Event = db.Event;

/**
 * POST /api/analytics/collect
 */
export const collectEvent = async (req, res) => {
  try {
    const { event, url, referrer, device, userId, ipAddress, metadata } = req.body;

    if (!event || typeof event !== "string" || event.trim() === "") {
      return res.status(400).json({ message: "Event name is required" });
    }

    const apiKeyValue = req.apiKeyInfo.apiKey;

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

    // Invalidate cache
    try {
      const cacheKeyAll = `event-summary:${apiKeyValue}:all`;
      const cacheKeySpecific = `event-summary:${apiKeyValue}:${event.trim()}`;
      await redisClient.del(cacheKeyAll, cacheKeySpecific);
    } catch (err) {}

    return res.status(201).json({
      message: "Event collected successfully",
      id: newEvent.id,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error collecting event",
      error: err.message,
    });
  }
};

/**
 * GET /api/analytics/event-summary?event=LOGIN
 * Phase 1: DB Aggregation Only (NO REDIS)
 */
export const getEventSummary = async (req, res) => {
  try {
    const { event } = req.query;
    const apiKeyValue = req.apiKeyInfo.apiKey;

    // Build WHERE clause
    const whereClause = { apiKey: apiKeyValue };
    if (event) whereClause.event = event;

    // Total count
    const totalEvents = await Event.count({
      where: whereClause
    });

    // Group by device
    const byDevice = await Event.findAll({
      attributes: [
        "device",
        [db.sequelize.fn("COUNT", db.sequelize.col("device")), "count"]
      ],
      where: whereClause,
      group: ["device"]
    });

    // Group by referrer
    const byReferrer = await Event.findAll({
      attributes: [
        "referrer",
        [db.sequelize.fn("COUNT", db.sequelize.col("referrer")), "count"]
      ],
      where: whereClause,
      group: ["referrer"]
    });

    return res.json({
      eventFilter: event || "all",
      totalEvents,
      byDevice,
      byReferrer
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error fetching analytics summary",
      error: err.message,
    });
  }
};
