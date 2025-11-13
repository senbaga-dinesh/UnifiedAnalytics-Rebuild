// src/routes/authRoutes.js
import express from "express";
import {
  registerApp,
  getApiKeyDetails,
  revokeApiKey,
  regenerateApiKey,
  listApiKeys,
} from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/register → register new app + generate API key
router.post("/register", registerApp);

// GET /api/auth/api-key?key=xxx → fetch details about a key
router.get("/api-key", getApiKeyDetails);

// DELETE /api/auth/api-key/:key → revoke key
router.delete("/api-key/:key", revokeApiKey);

// PUT /api/auth/api-key/:key/regenerate → regenerate key
router.put("/api-key/:key/regenerate", regenerateApiKey);

// GET /api/auth/list → admin view of all keys
router.get("/list", listApiKeys);

export default router;
