import express from "express";
import {
  registerApp,
  revokeApiKey,
  regenerateApiKey,
  listApiKeys,
  getApiKeyDetails,
} from "../controllers/authController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API Key management
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register an app and generate an API key
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appName: { type: string }
 *               ownerEmail: { type: string }
 *     responses:
 *       201:
 *         description: API key created
 */
router.post("/register", registerApp);

/**
 * @swagger
 * /api/auth/api-key:
 *   get:
 *     tags: [Auth]
 *     summary: Get API key details
 *     parameters:
 *       - in: query
 *         name: key
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Key details returned
 */
router.get("/api-key", getApiKeyDetails);

/**
 * @swagger
 * /api/auth/api-key/{key}:
 *   delete:
 *     tags: [Auth]
 *     summary: Revoke an API key
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Key revoked
 */
router.delete("/api-key/:key", revokeApiKey);

/**
 * @swagger
 * /api/auth/api-key/{key}/regenerate:
 *   put:
 *     tags: [Auth]
 *     summary: Regenerate an API key
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: New key generated
 */
router.put("/api-key/:key/regenerate", regenerateApiKey);

/**
 * @swagger
 * /api/auth/list:
 *   get:
 *     tags: [Auth]
 *     summary: List all API keys
 *     responses:
 *       200:
 *         description: API key list returned
 */
router.get("/list", listApiKeys);

export default router;
