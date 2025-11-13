import db from "../models/index.js";
import { redisClient } from "../config/redis.js";

const Event = db.Event;

// post /api/analytics/collect-event
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

    // CACHE INVALIDATION
    const apiKey = req.apiKeyInfo.apiKey;
    await redisClient.del(
      `event-summary:${apiKey}:all`,
      `event-summary:${apiKey}:${event}`
    );

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

// GET /api/analytics/event-summary
export const getEventSummary = async (req, res) => {
  try {
    const { event } = req.query;
    const apiKey = req.apiKeyInfo.apiKey;

    const cacheKey = `event-summary:${apiKey}:${event || "all"}`;

    // Check Redis cache
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("Served from Redis cache");
      return res.json(JSON.parse(cached));
    }

    // Query database
    const whereClause = { apiKey };
    if (event) whereClause.event = event;

    const totalEvents = await Event.count({ where: whereClause });

    const byDevice = await Event.findAll({
      attributes: [
        "device",
        [db.sequelize.fn("COUNT", db.sequelize.col("device")), "count"]
      ],
      where: whereClause,
      group: ["device"],
    });

    const byReferrer = await Event.findAll({
      attributes: [
        "referrer",
        [db.sequelize.fn("COUNT", db.sequelize.col("referrer")), "count"]
      ],
      where: whereClause,
      group: ["referrer"],
    });

    const result = { totalEvents, byDevice, byReferrer };

    // Save to Redis – 60 seconds
    await redisClient.setex(cacheKey, 60, JSON.stringify(result));

    res.json(result);

  } catch (err) {
    res.status(500).json({
      message: "Error in summary",
      error: err.message,
    });
  }
};

//GET /api/analytics/user-stats
export const getUserStats = async (req, res) => {
  try {
    const { userId } = req.query;
    const apiKey = req.apiKeyInfo.apiKey;

    if (!userId || userId.trim() === "") {
      return res.status(400).json({ message: "userId is required" });
    }

    const cleanUserId = userId.trim();

    // Total events for this user
    const totalEvents = await Event.count({
      where: { apiKey, userId: cleanUserId }
    });

    // Recent events (last 10)
    const recentEvents = await Event.findAll({
      where: { apiKey, userId: cleanUserId },
      order: [["timestamp", "DESC"]],
      limit: 10,
    });

    // Group by device
    const byDevice = await Event.findAll({
      attributes: [
        "device",
        [db.sequelize.fn("COUNT", db.sequelize.col("device")), "count"]
      ],
      where: { apiKey, userId: cleanUserId },
      group: ["device"],
    });

    return res.json({
      userId: cleanUserId,
      totalEvents,
      recentEvents,
      byDevice,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error fetching user stats",
      error: err.message,
    });
  }
};
