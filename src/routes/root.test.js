const request = require("supertest");
const { app } = require("../server");

describe("Welcome", () => {
  describe("GET /", () => {
    test("should return a basci message for root route", async () => {
      const res = await request(app).post("/").send();
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toEqual("Welcome to Automobile API.");
    });
  });
});
