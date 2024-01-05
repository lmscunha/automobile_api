const request = require("supertest");
const { app } = require("../../../../server");

describe("Automobiles Resource", () => {
  describe("GET /automobiles", () => {
    test("should list all automobiles", async () => {
      const autoCreated1 = await request(app).post("/automobiles").send({
        licensePlate: "AAA1A11",
        color: "Red",
        brand: "Foo",
      });

      const autoCreated2 = await request(app).post("/automobiles").send({
        licensePlate: "AAA1A12",
        color: "Blue",
        brand: "Baa",
      });

      const autoCreated3 = await request(app).post("/automobiles").send({
        licensePlate: "AAA1A13",
        color: "Yellow",
        brand: "Foo Baa",
      });

      const res = await request(app).get(`/automobiles`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.automobile.length).toEqual(3);
      expect(res.body.data.automobile[0].id).toEqual(
        autoCreated1.body.data.automobile.id,
      );
      expect(res.body.data.automobile[1].id).toEqual(
        autoCreated2.body.data.automobile.id,
      );
      expect(res.body.data.automobile[2].id).toEqual(
        autoCreated3.body.data.automobile.id,
      );
    });

    test("should filter the automobiles by color", async () => {
      const autoCreated1 = await request(app).post("/automobiles").send({
        licensePlate: "AAA1A14",
        color: "Purple",
        brand: "Foo",
      });

      const autoCreated2 = await request(app).post("/automobiles").send({
        licensePlate: "AAA1A15",
        color: "Purple",
        brand: "Baa",
      });

      await request(app).post("/automobiles").send({
        licensePlate: "AAA1A16",
        color: "Yellow",
        brand: "Foo Baa",
      });

      const color = "Purple";
      const res = await request(app).get(`/automobiles?color=${color}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.automobile.length).toEqual(2);
      expect(res.body.data.automobile[0].id).toEqual(
        autoCreated1.body.data.automobile.id,
      );
      expect(res.body.data.automobile[1].id).toEqual(
        autoCreated2.body.data.automobile.id,
      );
      expect(res.body.data.automobile[0].color).toEqual(color);
      expect(res.body.data.automobile[1].color).toEqual(color);
    });

    test("should filter the automobiles by brand", async () => {
      await request(app).post("/automobiles").send({
        licensePlate: "AAA1A17",
        color: "Purple",
        brand: "Foo1",
      });

      const autoCreated2 = await request(app).post("/automobiles").send({
        licensePlate: "AAA1A18",
        color: "Purple",
        brand: "Baa2",
      });

      await request(app).post("/automobiles").send({
        licensePlate: "AAA1A19",
        color: "Yellow",
        brand: "Foo Baa",
      });

      const brand = "Baa2";
      const res = await request(app).get(`/automobiles?brand=${brand}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.automobile.length).toEqual(1);
      expect(res.body.data.automobile[0].id).toEqual(
        autoCreated2.body.data.automobile.id,
      );
      expect(res.body.data.automobile[0].brand).toEqual(brand);
    });

    test("should filter the automobiles by color and brand", async () => {
      await request(app).post("/automobiles").send({
        licensePlate: "AAA1A21",
        color: "Purple",
        brand: "Foo1",
      });

      const autoCreated2 = await request(app).post("/automobiles").send({
        licensePlate: "AAA1A22",
        color: "Purple1",
        brand: "Baa3",
      });

      await request(app).post("/automobiles").send({
        licensePlate: "AAA1A23",
        color: "Yellow",
        brand: "Foo Baa",
      });

      const color = "Purple1";
      const brand = "Baa3";
      const res = await request(app).get(
        `/automobiles?color=${color}&brand=${brand}`,
      );

      expect(res.statusCode).toBe(200);
      expect(res.body.data.automobile.length).toEqual(1);
      expect(res.body.data.automobile[0].id).toEqual(
        autoCreated2.body.data.automobile.id,
      );
      expect(res.body.data.automobile[0].color).toEqual(color);
      expect(res.body.data.automobile[0].brand).toEqual(brand);
    });

    test("should get the automobile by ID", async () => {
      const autoCreated = await request(app).post("/automobiles").send({
        licensePlate: "AAA1A24",
        color: "Red",
        brand: "Foo",
      });

      const autoId = autoCreated.body.data.automobile.id;
      const res = await request(app).get(`/automobiles/${autoId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.automobile.id).toEqual(autoId);
      expect(res.body.data.automobile.licensePlate).toEqual("AAA1A24");
      expect(res.body.data.automobile.color).toEqual("Red");
      expect(res.body.data.automobile.brand).toEqual("Foo");
    });
  });

  describe("POST /automobiles", () => {
    test("should register automobile", async () => {
      const res = await request(app).post("/automobiles").send({
        licensePlate: "AAA1A26",
        color: "Green",
        brand: "Foo",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.automobile).toHaveProperty("id");
      expect(res.body.data.automobile.licensePlate).toEqual("AAA1A26");
      expect(res.body.data.automobile.color).toEqual("Green");
      expect(res.body.data.automobile.brand).toEqual("Foo");
    });

    test("should not register the automobile if no data is send", async () => {
      const res = await request(app).post("/automobiles").send();

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toEqual("invalid-automobile-data");
    });
  });

  describe("PUT /automobiles", () => {
    test("should update the automobile color", async () => {
      const autoCreated = await request(app).post("/automobiles").send({
        licensePlate: "AAA1A28",
        color: "Red",
        brand: "Foo",
      });

      const autoId = autoCreated.body.data.automobile.id;
      const res = await request(app).put(`/automobiles/${autoId}`).send({
        color: "Blue",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.automobile.id).toEqual(autoId);
      expect(res.body.data.automobile.licensePlate).toEqual("AAA1A28");
      expect(res.body.data.automobile.color).toEqual("Blue");
      expect(res.body.data.automobile.brand).toEqual("Foo");
    });

    test("should not update the automobile if no data is send", async () => {
      const autoCreated = await request(app).post("/automobiles").send({
        licensePlate: "AAA1A29",
        color: "Red",
        brand: "Foo",
      });

      const autoId = autoCreated.body.data.automobile.id;
      const res = await request(app).put(`/automobiles/${autoId}`).send();

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toEqual("invalid-data-to-update");
    });
  });

  describe("DELETE /automobiles", () => {
    test("should remove the automobile by ID", async () => {
      const autoCreated = await request(app).post("/automobiles").send({
        licensePlate: "AAA1A30",
        color: "Red",
        brand: "Foo",
      });

      const autoId = autoCreated.body.data.automobile.id;
      const res = await request(app).delete(`/automobiles/${autoId}`);

      expect(res.statusCode).toBe(204);
    });

    test("should not featch a deleted automobile", async () => {
      const autoCreated = await request(app).post("/automobiles").send({
        licensePlate: "AAA1A31",
        color: "Red",
        brand: "Foo",
      });

      const autoId = autoCreated.body.data.automobile.id;
      await request(app).delete(`/automobiles/${autoId}`);
      const res = await request(app).get(`/automobiles/${autoId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toEqual("no-automobile-found");
    });
  });
});
