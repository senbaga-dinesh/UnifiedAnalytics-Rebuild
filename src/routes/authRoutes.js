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
 *   description: API Key registration and management
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new app and generate an API key
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appName:
 *                 type: string
 *                 example: MyWebsite
 *               ownerEmail:
 *                 type: string
 *                 example: owner@example.com
 *     responses:
 *       201:
 *         description: API key generated successfully
 */
router.post("/register", registerApp);

/**
 * @swagger
 * /api/auth/api-key:
 *   get:
 *     summary: Get details of an API key
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: API key to lookup
 *     responses:
 *       200:
 *         description: API key details
 */
router.get("/api-key", getApiKeyDetails);

/**
 * @swagger
 * /api/auth/api-key/{key}:
 *   delete:
 *     summary: Revoke an existing API key
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: API key revoked
 */
router.delete("/api-key/:key", revokeApiKey);

/**
 * @swagger
 * /api/auth/api-key/{key}/regenerate:
 *   put:
 *     summary: Regenerate an API key
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: New API key generated
 */
router.put("/api-key/:key/regenerate", regenerateApiKey);

/**
 * @swagger
 * /api/auth/list:
 *   get:
 *     summary: List all API keys
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: List of keys
 */
router.get("/list", listApiKeys);

export default router;
