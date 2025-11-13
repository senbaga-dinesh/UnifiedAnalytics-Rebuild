import db from "../models/index.js";
const ApiKey = db.ApiKey;

export const verifyApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey) return res.status(401).json({ message: "Missing API key in headers" });

    const record = await ApiKey.findOne({ where: { apiKey } });
    if (!record) return res.status(403).json({ message: "Invalid API key" });
    if (!record.isActive) return res.status(403).json({ message: "API key revoked" });

    // expiry check
    if (record.expiresAt && new Date(record.expiresAt) < new Date()) {
      return res.status(403).json({ message: "API key has expired" });
    }

    req.apiKeyInfo = record;
    next();
  } catch (err) {
    console.error("verifyApiKey error:", err);
    res.status(500).json({ message: "Error validating API key", error: err.message });
  }
};
