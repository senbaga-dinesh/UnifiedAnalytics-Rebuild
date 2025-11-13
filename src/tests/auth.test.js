import request from "supertest";
import app, { server } from "../server.js";
import db from "../models/index.js";
import { redisClient } from "../config/redis.js";

describe("Auth API Tests", () => {

  afterAll(async () => {
    await db.sequelize.close();
    await redisClient.quit();
    server.close();
  });

  test("POST /api/auth/register → should register app and return an API key", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        appName: "TestApp",
        ownerEmail: "test@example.com",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("apiKey");
    expect(res.body.apiKey.length).toBe(64);
    expect(res.body).toHaveProperty("expiresAt");
  });

  test("POST /api/auth/register → should fail if body missing fields", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ appName: "IncompleteApp" }); // missing email

    expect(res.statusCode).toBe(400);
  });

});
