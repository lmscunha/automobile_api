const request = require("supertest");
const { app } = require("../../../../server");

describe("Drivers Resource", () => {
  describe("GET /drivers", () => {
    test("should list all drivers", async () => {
      const driverCreated1 = await request(app).post("/drivers").send({
        name: "John",
      });

      const driverCreated2 = await request(app).post("/drivers").send({
        name: "John2",
      });

      const res = await request(app).get("/drivers");

      expect(res.statusCode).toBe(200);
      expect(res.body.data.driver.length).toEqual(2);
      expect(res.body.data.driver[0].id).toEqual(
        driverCreated1.body.data.driver.id,
      );
      expect(res.body.data.driver[1].id).toEqual(
        driverCreated2.body.data.driver.id,
      );
    });

    test("should filter the driver by name", async () => {
      const driverCreated1 = await request(app).post("/drivers").send({
        name: "John3",
      });

      const driverCreated2 = await request(app).post("/drivers").send({
        name: "John4",
      });

      const name = "John4";
      const res = await request(app).get(`/drivers?name=${name}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.driver.length).toEqual(1);
      expect(res.body.data.driver[0].id).toEqual(
        driverCreated2.body.data.driver.id,
      );
      expect(res.body.data.driver[0].name).toEqual(name);
    });

    test("should get the driver by ID", async () => {
      const driverCreated1 = await request(app).post("/drivers").send({
        name: "John4",
      });

      const driverCreated2 = await request(app).post("/drivers").send({
        name: "John5",
      });

      const driverId = driverCreated2.body.data.driver.id;
      const res = await request(app).get(`/drivers/${driverId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.driver.id).toEqual(driverId);
      expect(res.body.data.driver.name).toEqual("John5");
    });
  });

  describe("POST /drivers", () => {
    test("should register driver", async () => {
      const res = await request(app).post("/drivers").send({
        name: "John6",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.driver).toHaveProperty("id");
      expect(res.body.data.driver.name).toEqual("John6");
    });

    test("should not register the driver if no data is send", async () => {
      const res = await request(app).post("/drivers").send();

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toEqual("invalid-driver-data");
    });
  });

  describe("PUT /drivers", () => {
    test("should update the driver name", async () => {
      const driverCreated = await request(app).post("/drivers").send({
        name: "John7",
      });

      const driverId = driverCreated.body.data.driver.id;
      const res = await request(app).put(`/drivers/${driverId}`).send({
        name: "John8",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.driver.id).toEqual(driverId);
      expect(res.body.data.driver.name).toEqual("John8");
    });

    test("should not update the driver if no data is send", async () => {
      const driverCreated = await request(app).post("/drivers").send({
        name: "John9",
      });

      const driverId = driverCreated.body.data.driver.id;
      const res = await request(app).put(`/drivers/${driverId}`).send();

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toEqual("invalid-data-to-update");
    });
  });

  describe("DELETE /drivers", () => {
    test("should remove the driver by ID", async () => {
      const driverCreated = await request(app).post("/drivers").send({
        name: "John10",
      });

      const driverId = driverCreated.body.data.driver.id;
      const res = await request(app).delete(`/drivers/${driverId}`);

      expect(res.statusCode).toBe(204);
    });

    test("should not featch a deleted driver", async () => {
      const driverCreated = await request(app).post("/drivers").send({
        name: "John11",
      });

      const driverId = driverCreated.body.data.driver.id;
      await request(app).delete(`/drivers/${driverId}`);
      const res = await request(app).get(`/drivers/${driverId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toEqual("no-driver-found");
    });
  });
});
