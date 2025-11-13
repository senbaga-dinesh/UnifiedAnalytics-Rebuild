import rateLimit from "express-rate-limit";

/**
 * API Key–based Rate Limiter
 * Prevents abuse by limiting requests per API key.
 */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // max requests per API key per minute

  keyGenerator: (req) => {
    return req.headers["x-api-key"] || req.ip; // fallback to IP
  },

  message: {
    message: "Too many requests for this API key. Try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});
