import { jest } from "@jest/globals";
import request from "supertest";

// 🔥 ESM-compatible mocks
jest.unstable_mockModule("../config/redis.js", () => ({
  redisClient: {
    get: jest.fn(() => null),
    setex: jest.fn(),
    del: jest.fn(),
    quit: jest.fn(),
  }
}));

jest.unstable_mockModule("../models/index.js", () => ({
  default: {
    sequelize: { close: jest.fn() },
    Event: {
      create: jest.fn(() => ({ id: 1 })),
      count: jest.fn(() => 0),
      findAll: jest.fn(() => []),
    }
  }
}));

jest.unstable_mockModule("../middleware/authMiddleware.js", () => ({
  verifyApiKey: jest.fn((req, res, next) => {
    if (req.headers["x-api-key"] === "MOCK_KEY") {
      req.apiKeyInfo = { apiKey: "MOCK_KEY" };
      return next();
    }
    return res.status(401).json({ message: "Invalid API key" });
  })
}));

// MUST import after mocks
const { default: app } = await import("../server.js");

describe("Integration: Analytics API", () => {

  test("reject event collection without an API key", async () => {
    const res = await request(app)
      .post("/api/analytics/collect")
      .send({ event: "test_event" });

    expect(res.statusCode).toBe(401);
  });

  test("reject event with invalid API key", async () => {
    const res = await request(app)
      .post("/api/analytics/collect")
      .set("x-api-key", "INVALID")
      .send({
        event: "click_button",
        device: "mobile",
      });

    expect([401, 403]).toContain(res.statusCode);
  });

  test("accept event with VALID API key (mocked)", async () => {
    const res = await request(app)
      .post("/api/analytics/collect")
      .set("x-api-key", "MOCK_KEY")
      .send({
        event: "page_visit",
        url: "https://myapp.com/home",
        device: "desktop",
      });

    expect([200, 201]).toContain(res.statusCode);
  });

});
