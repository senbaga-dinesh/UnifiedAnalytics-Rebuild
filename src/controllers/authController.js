// src/controllers/authController.js
import db from "../models/index.js";
import { generateApiKey } from "../utils/generateApiKey.js";

const ApiKey = db.ApiKey;

/**
 * Register a new app and generate API key
 */
export const registerApp = async (req, res) => {
  try {
    const { appName, ownerEmail } = req.body;

    if (!appName || !ownerEmail) {
      return res.status(400).json({ message: "appName and ownerEmail are required" });
    }

    const newKey = generateApiKey();

    const apiKey = await ApiKey.create({
      appName,
      ownerEmail,
      apiKey: newKey,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    return res.status(201).json({
      message: "App registered successfully",
      apiKey: apiKey.apiKey,
      expiresAt: apiKey.expiresAt,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error registering app",
      error: err.message,
    });
  }
};

/**
 * Get details of a specific API key
 */
export const getApiKeyDetails = async (req, res) => {
  try {
    const { key } = req.query;

    if (!key) {
      return res.status(400).json({ message: "API key is required" });
    }

    const trimmed = key.trim();

    const apiKey = await ApiKey.findOne({ where: { apiKey: trimmed } });

    if (!apiKey) {
      return res.status(404).json({ message: "API key not found" });
    }

    return res.json({
      appName: apiKey.appName,
      ownerEmail: apiKey.ownerEmail,
      isActive: apiKey.isActive,
      expiresAt: apiKey.expiresAt,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching API key details",
      error: err.message,
    });
  }
};

/**
 * Revoke an API key
 */
export const revokeApiKey = async (req, res) => {
  try {
    const { key } = req.params;

    const apiKey = await ApiKey.findOne({ where: { apiKey: key } });

    if (!apiKey) {
      return res.status(404).json({ message: "API key not found" });
    }

    apiKey.isActive = false;
    await apiKey.save();

    return res.json({ message: "API key revoked successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Error revoking API key",
      error: err.message,
    });
  }
};

/**
 * Regenerate API key
 */
export const regenerateApiKey = async (req, res) => {
  try {
    const { key } = req.params;

    const apiKey = await ApiKey.findOne({ where: { apiKey: key } });

    if (!apiKey) {
      return res.status(404).json({ message: "API key not found" });
    }

    const newKey = generateApiKey();

    apiKey.apiKey = newKey;
    apiKey.isActive = true;
    apiKey.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await apiKey.save();

    return res.json({
      message: "API key regenerated successfully",
      apiKey: newKey,
      expiresAt: apiKey.expiresAt,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error regenerating API key",
      error: err.message,
    });
  }
};

/**
 * List all API keys
 */
export const listApiKeys = async (req, res) => {
  try {
    const keys = await ApiKey.findAll({
      attributes: ["id", "appName", "ownerEmail", "apiKey", "isActive", "expiresAt", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      total: keys.length,
      keys,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching API keys",
      error: err.message,
    });
  }
};
