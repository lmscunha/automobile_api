const request = require("supertest");
const { app } = require("../../../../server");

describe("usages Resource", () => {
  describe("GET /usages", () => {
    test("should list all automobile usages", async () => {
      const auto1 = await request(app).post("/automobiles").send({
        licensePlate: "AAA1A11",
        brand: "Foo",
        color: "Blue",
      });

      const driver1 = await request(app).post("/drivers").send({
        name: "John",
      });

      const auto2 = await request(app).post("/automobiles").send({
        licensePlate: "AAA1A12",
        brand: "Foo",
        color: "Red",
      });

      const driver2 = await request(app).post("/drivers").send({
        name: "Doe",
      });

      await request(app).post("/usages").send({
        startDate: "11/12/23",
        driverId: driver1.body.data.driver.id,
        automobileId: auto1.body.data.automobile.id,
        reason: "Test",
      });

      await request(app).post("/usages").send({
        startDate: "12/12/23",
        driverId: driver2.body.data.driver.id,
        automobileId: auto2.body.data.automobile.id,
        reason: "Test 2",
      });

      const res = await request(app).get("/usages");

      expect(res.statusCode).toBe(200);
      expect(res.body.data.automobileUsage.length).toEqual(2);
      expect(res.body.data.automobileUsage[0].automobile.id).toEqual(
        auto1.body.data.automobile.id,
      );
      expect(res.body.data.automobileUsage[1].automobile.id).toEqual(
        auto2.body.data.automobile.id,
      );
      expect(res.body.data.automobileUsage[0].driver.id).toEqual(
        driver1.body.data.driver.id,
      );
      expect(res.body.data.automobileUsage[1].driver.id).toEqual(
        driver2.body.data.driver.id,
      );
    });
  });

  describe("POST /usages", () => {
    test("should register an automobile usage", async () => {
      const auto1 = await request(app).post("/automobiles").send({
        licensePlate: "BAA1A11",
        brand: "Foo",
        color: "Blue",
      });

      const driver1 = await request(app).post("/drivers").send({
        name: "John",
      });

      const res = await request(app).post("/usages").send({
        startDate: "11/12/23",
        driverId: driver1.body.data.driver.id,
        automobileId: auto1.body.data.automobile.id,
        reason: "Test",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.automobileUsage).toHaveProperty("id");
      expect(res.body.data.automobileUsage.driver.name).toEqual("John");
      expect(res.body.data.automobileUsage.automobile.licensePlate).toEqual(
        "BAA1A11",
      );
    });

    test("should not register the automobile-usage if no data is send", async () => {
      await request(app).post("/automobiles").send({
        licensePlate: "BAA1A11",
        brand: "Foo",
        color: "Blue",
      });

      await request(app).post("/drivers").send({
        name: "John",
      });

      const res = await request(app).post("/usages").send();

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toEqual("invalid-automobile-usage-data");
    });

    test("should not register the automobile-usage if the driver was not registered", async () => {
      const auto1 = await request(app).post("/automobiles").send({
        licensePlate: "BAA1A33",
        brand: "Foo",
        color: "Blue",
      });

      const res = await request(app).post("/usages").send({
        startDate: "11/12/23",
        driverId: "123",
        automobileId: auto1.body.data.automobile.id,
        reason: "Test",
      });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toEqual("no-driver-found");
    });

    test("should not register the automobile-usage if the automobile was not registered", async () => {
      const driver1 = await request(app).post("/drivers").send({
        name: "John5",
      });

      const res = await request(app).post("/usages").send({
        startDate: "11/12/23",
        driverId: driver1.body.data.driver.id,
        automobileId: "123",
        reason: "Test",
      });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toEqual("no-automobile-found");
    });

    test("should not register bad input", async () => {
      const auto1 = await request(app).post("/automobiles").send({
        licensePlate: "BBA1A22",
        brand: "Foo",
        color: "Blue",
      });

      const driver1 = await request(app).post("/drivers").send({
        name: "John Doe",
      });

      const res = await request(app).post("/usages").send({
        startDate: "11/12/23",
        driverId: driver1.body.data.driver.id,
        automobileId: auto1.body.data.automobile.id,
        reason: "Test",
        foo: "Bad",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.automobileUsage).toHaveProperty("id");
      expect(res.body.data.automobileUsage).not.toHaveProperty("foo");
      expect(res.body.data.automobileUsage.driver.name).toEqual("John Doe");
      expect(res.body.data.automobileUsage.automobile.licensePlate).toEqual(
        "BBA1A22",
      );
    });
  });

  describe("PUT /usages", () => {
    test("should add automobile-usage endDate", async () => {
      const auto1 = await request(app).post("/automobiles").send({
        licensePlate: "BAA1A12",
        brand: "Foo",
        color: "Blue",
      });

      const driver1 = await request(app).post("/drivers").send({
        name: "John1",
      });

      const autoUsage = await request(app).post("/usages").send({
        startDate: "11/12/23",
        driverId: driver1.body.data.driver.id,
        automobileId: auto1.body.data.automobile.id,
        reason: "Test",
      });

      const res = await request(app)
        .put(`/usages/${autoUsage.body.data.automobileUsage.id}`)
        .send({
          endDate: "16/12/23",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.automobileUsage.id).toEqual(
        autoUsage.body.data.automobileUsage.id,
      );
      expect(res.body.data.automobileUsage.endDate).toEqual("16/12/23");
    });

    test("should not update the automobile usage if no data is send", async () => {
      const auto1 = await request(app).post("/automobiles").send({
        licensePlate: "BAA1A13",
        brand: "Foo",
        color: "Blue",
      });

      const driver1 = await request(app).post("/drivers").send({
        name: "John1",
      });

      const autoUsage = await request(app).post("/usages").send({
        startDate: "11/12/23",
        driverId: driver1.body.data.driver.id,
        automobileId: auto1.body.data.automobile.id,
        reason: "Test",
      });

      const res = await request(app)
        .put(`/usages/${autoUsage.body.data.automobileUsage.id}`)
        .send();

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toEqual("invalid-date-format");
    });

    test("should not update the automobile-usage if the end date is less than the startDate", async () => {
      const auto1 = await request(app).post("/automobiles").send({
        licensePlate: "BAA1A15",
        brand: "Foo",
        color: "Blue",
      });

      const driver1 = await request(app).post("/drivers").send({
        name: "John3",
      });

      const autoUsage = await request(app).post("/usages").send({
        startDate: "11/12/23",
        driverId: driver1.body.data.driver.id,
        automobileId: auto1.body.data.automobile.id,
        reason: "Test",
      });

      const res = await request(app)
        .put(`/usages/${autoUsage.body.data.automobileUsage.id}`)
        .send({
          endDate: "10/12/23",
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toEqual("invalid-end-date");
    });

    test("should not update bad input", async () => {
      const auto1 = await request(app).post("/automobiles").send({
        licensePlate: "BAA1A25",
        brand: "Foo",
        color: "Blue",
      });

      const driver1 = await request(app).post("/drivers").send({
        name: "John6",
      });

      const autoUsage = await request(app).post("/usages").send({
        startDate: "11/12/23",
        driverId: driver1.body.data.driver.id,
        automobileId: auto1.body.data.automobile.id,
        reason: "Test",
      });

      const res = await request(app)
        .put(`/usages/${autoUsage.body.data.automobileUsage.id}`)
        .send({
          foo: "Bad",
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toEqual("invalid-date-format");
    });
  });
});
