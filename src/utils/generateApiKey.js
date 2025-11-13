// src/utils/generateApiKey.js
import crypto from "crypto";

/**
 * Generates a secure 64-character API key
 * using cryptographically strong random bytes.
 */
export const generateApiKey = () => {
  return crypto.randomBytes(32).toString("hex"); 
};
