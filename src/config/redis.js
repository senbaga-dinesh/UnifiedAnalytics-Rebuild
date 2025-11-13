import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("ready", () => {
  // ready means usable
  // console.log("Redis is ready");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

export { redisClient };
