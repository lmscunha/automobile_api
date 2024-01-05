const {
  AutomobileRepositoryFaker,
} = require("../../data-access/automobile-fake-repository");
const { AutomobileService } = require("../../domain/automobile-service");

const repositoryFaker = new AutomobileRepositoryFaker();
const automobileService = new AutomobileService(repositoryFaker);

describe("AutomobileService", () => {
  afterEach(async () => {
    await repositoryFaker.reset();
  });

  describe("getAllAutomobiles", () => {
    test("should return [] if no automobile was registered", async () => {
      const result = await automobileService.getAllAutomobiles({});

      expect(result).toEqual({ ok: true, automobile: [] });
    });

    test("should return yellow automobiles when filter by color yellow", async () => {
      await automobileService.registerAutomobile({
        licensePlate: "AAA1A11",
        brand: "Foo",
        color: "Blue",
      });

      const auto = await automobileService.registerAutomobile({
        licensePlate: "AAA1A12",
        brand: "Foo",
        color: "Yellow",
      });

      await automobileService.registerAutomobile({
        licensePlate: "AAA1A13",
        brand: "Foo",
        color: "Red",
      });

      const result = await automobileService.getAllAutomobiles({
        color: "Yellow",
      });

      expect(result).toEqual({
        ok: true,
        automobile: [
          {
            id: auto.automobile.id,
            licensePlate: "AAA1A12",
            brand: "Foo",
            color: "Yellow",
          },
        ],
      });
      expect(result.automobile.length).toEqual(1);
    });

    test("should return all automobiles if no filter is passed", async () => {
      await automobileService.registerAutomobile({
        licensePlate: "AAA1A11",
        brand: "Foo",
        color: "Blue",
      });

      await automobileService.registerAutomobile({
        licensePlate: "AAA1A12",
        brand: "Foo",
        color: "Yellow",
      });

      await automobileService.registerAutomobile({
        licensePlate: "AAA1A13",
        brand: "Foo",
        color: "Red",
      });

      const result = await automobileService.getAllAutomobiles({});

      expect(result.automobile.length).toEqual(3);
    });
  });

  describe("getAnAutomobile", () => {
    test("should return an automobile by ID", async () => {
      await automobileService.registerAutomobile({
        licensePlate: "AAA1A11",
        brand: "Foo",
        color: "Blue",
      });

      await automobileService.registerAutomobile({
        licensePlate: "AAA1A12",
        brand: "Foo",
        color: "Yellow",
      });

      const auto = await automobileService.registerAutomobile({
        licensePlate: "AAA1A13",
        brand: "Foo",
        color: "Red",
      });

      const result = await automobileService.getAnAutomobile(
        auto.automobile.id,
      );
      expect(result).toEqual({
        ok: true,
        automobile: {
          id: auto.automobile.id,
          licensePlate: "AAA1A13",
          brand: "Foo",
          color: "Red",
        },
      });
    });

    test("should return {ok:false, why:no-automobile-found} if the id do not belong to any automobile", async () => {
      await automobileService.registerAutomobile({
        licensePlate: "AAA1A11",
        brand: "Foo",
        color: "Blue",
      });

      await automobileService.registerAutomobile({
        licensePlate: "AAA1A12",
        brand: "Foo",
        color: "Yellow",
      });

      await automobileService.registerAutomobile({
        licensePlate: "AAA1A13",
        brand: "Foo",
        color: "Red",
      });

      const id = "123";
      const result = await automobileService.getAnAutomobile(id);

      expect(result).toEqual({
        ok: false,
        why: "no-automobile-found",
        status: 404,
      });
    });
  });

  describe("registerAutomobile", () => {
    test("should register an automobile", async () => {
      const result = await automobileService.registerAutomobile({
        licensePlate: "AAA1A11",
        brand: "Foo",
        color: "Blue",
      });

      expect(result).toEqual({
        ok: true,
        automobile: {
          id: result.automobile.id,
          licensePlate: "AAA1A11",
          brand: "Foo",
          color: "Blue",
        },
      });
    });
    test("should not register bad input", async () => {
      const result = await automobileService.registerAutomobile({
        licensePlate: "AAA1A11",
        brand: "Foo",
        color: "Blue",
        foo: "Bad",
      });

      expect(result.automobile).not.toHaveProperty("foo");
    });

    test("should return {ok:false, why:invalid-automobile-data} if all data is missing", async () => {
      const result = await automobileService.registerAutomobile({});

      expect(result).toEqual({
        ok: false,
        why: "invalid-automobile-data",
        status: 403,
      });
    });

    test("should return {ok:false, why:invalid-automobile-data} if the color is missing", async () => {
      const result = await automobileService.registerAutomobile({
        licensePlate: "AAA1A11",
        brand: "Foo",
      });

      expect(result).toEqual({
        ok: false,
        why: "invalid-automobile-data",
        status: 403,
      });
    });

    test("should return {ok:false, why:invalid-automobile-data} if the brand is missing", async () => {
      const result = await automobileService.registerAutomobile({
        licensePlate: "AAA1A11",
        color: "Blue",
      });

      expect(result).toEqual({
        ok: false,
        why: "invalid-automobile-data",
        status: 403,
      });
    });

    test("should return {ok:false, why:invalid-automobile-data} if the licensePlate is missing", async () => {
      const result = await automobileService.registerAutomobile({
        color: "Blue",
        brand: "Foo",
      });

      expect(result).toEqual({
        ok: false,
        why: "invalid-automobile-data",
        status: 403,
      });
    });

    test("should return {ok:false, why:invalid-license-plate} if the licensePlate does not have a valid format", async () => {
      const result = await automobileService.registerAutomobile({
        licensePlate: "ABC",
        brand: "Foo",
        color: "Blue",
      });

      expect(result).toEqual({
        ok: false,
        why: "invalid-license-plate",
        status: 403,
      });
    });

    test("should return {ok:false, why:invalid-license-plate} if the licensePlate was already registed", async () => {
      await automobileService.registerAutomobile({
        licensePlate: "AAA1A11",
        brand: "Foo",
        color: "Blue",
      });

      const result = await automobileService.registerAutomobile({
        licensePlate: "AAA1A11",
        brand: "Foo",
        color: "Blue",
      });

      expect(result).toEqual({
        ok: false,
        why: "invalid-license-plate",
        status: 403,
      });
    });
  });

  describe("updateAutomobile", () => {
    test("should update an automobile", async () => {
      const auto = await automobileService.registerAutomobile({
        licensePlate: "AAA1A11",
        brand: "Foo",
        color: "Blue",
      });

      const result = await automobileService.updateAutomobile(
        auto.automobile.id,
        {
          color: "Red",
        },
      );

      expect(result).toEqual({
        ok: true,
        automobile: {
          id: auto.automobile.id,
          licensePlate: "AAA1A11",
          brand: "Foo",
          color: "Red",
        },
      });
    });

    test("should not update if there is no data to update", async () => {
      const auto = await automobileService.registerAutomobile({
        licensePlate: "AAA1A11",
        brand: "Foo",
        color: "Blue",
      });

      const result = await automobileService.updateAutomobile(auto.id, {});

      expect(result).toEqual({
        ok: false,
        why: "invalid-data-to-update",
        status: 403,
      });
    });

    test("should not update bad input", async () => {
      const auto = await automobileService.registerAutomobile({
        licensePlate: "AAA1A11",
        brand: "Foo",
        color: "Blue",
      });

      const result = await automobileService.updateAutomobile(
        auto.automobile.id,
        {
          color: "Red",
          foo: "Bad",
        },
      );

      expect(result.automobile).not.toHaveProperty("foo");
    });

    test("should return {ok:false, why:no-automobile-found} if there is no automobile with that id", async () => {
      await automobileService.registerAutomobile({
        licensePlate: "AAA1A11",
        brand: "Foo",
        color: "Blue",
      });

      const result = await automobileService.updateAutomobile("123", {
        color: "Red",
      });

      expect(result).toEqual({
        ok: false,
        why: "no-automobile-found",
        status: 404,
      });
    });
  });

  describe("deleteAutomobile", () => {
    test("should delete an automobile", async () => {
      const auto = await automobileService.registerAutomobile({
        licensePlate: "AAA1A11",
        brand: "Foo",
        color: "Blue",
      });

      const result = await automobileService.deleteAutomobile(
        auto.automobile.id,
      );

      expect(result).toBeUndefined();
      expect(await repositoryFaker.getById(auto.id)).toBeUndefined();
    });

    test("should return {ok:false, why:invalid-id} if there is no id", async () => {
      await automobileService.registerAutomobile({
        licensePlate: "AAA1A11",
        brand: "Foo",
        color: "Blue",
      });

      const result = await automobileService.deleteAutomobile();

      expect(result).toEqual({
        ok: false,
        why: "invalid-id",
        status: 403,
      });
    });
  });
});
