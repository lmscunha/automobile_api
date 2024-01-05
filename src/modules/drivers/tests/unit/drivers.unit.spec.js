const {
  DriverRepositoryFaker,
} = require("../../data-access/driver-fake-repository");
const { DriverService } = require("../../domain/driver-service");

const repositoryFaker = new DriverRepositoryFaker();
const driverService = new DriverService(repositoryFaker);

describe("DriverService", () => {
  afterEach(async () => {
    await repositoryFaker.reset();
  });

  describe("getAllDrivers", () => {
    test("should return [] if no driver was registered", async () => {
      const result = await driverService.getAllDrivers({});

      expect(result).toEqual({ ok: true, driver: [] });
    });

    test("should return driver John when filter by ones name", async () => {
      await driverService.registerDriver({
        name: "Doe",
      });

      const driver = await driverService.registerDriver({
        name: "John",
      });

      const result = await driverService.getAllDrivers({
        name: "John",
      });

      expect(result).toEqual({
        ok: true,
        driver: [
          {
            id: driver.driver.id,
            name: "John",
          },
        ],
      });
      expect(result.driver.length).toEqual(1);
    });

    test("should return all drivers if no filter is passed", async () => {
      await driverService.registerDriver({
        name: "Doe",
      });

      await driverService.registerDriver({
        name: "John",
      });

      const result = await driverService.getAllDrivers({});

      expect(result.driver.length).toEqual(2);
    });
  });

  describe("getADriver", () => {
    test("should return a automobile by ID", async () => {
      await driverService.registerDriver({
        name: "John",
      });

      const driver = await driverService.registerDriver({
        name: "Doe",
      });

      const result = await driverService.getADriver(driver.driver.id);
      expect(result).toEqual({
        ok: true,
        driver: {
          id: driver.driver.id,
          name: "Doe",
        },
      });
    });

    test("should return {ok:false, why:no-driver-found} if the id do not belong to any driver", async () => {
      await driverService.registerDriver({
        name: "John",
      });

      await driverService.registerDriver({
        name: "Doe",
      });

      const id = "123";
      const result = await driverService.getADriver(id);

      expect(result).toEqual({
        ok: false,
        why: "no-driver-found",
        status: 404,
      });
    });
  });

  describe("registerDriver", () => {
    test("should register a driver", async () => {
      const result = await driverService.registerDriver({
        name: "John",
      });

      expect(result).toEqual({
        ok: true,
        driver: {
          id: result.driver.id,
          name: "John",
        },
      });
    });

    test("should not register bad input", async () => {
      const result = await driverService.registerDriver({
        name: "John",
        foo: "Bad",
      });

      expect(result.driver).not.toHaveProperty("foo");
    });

    test("should return {ok:false, why:invalid-driver-data} if all data is missing", async () => {
      const result = await driverService.registerDriver({});

      expect(result).toEqual({
        ok: false,
        why: "invalid-driver-data",
        status: 403,
      });
    });

    describe("updateDriver", () => {
      test("should update a driver", async () => {
        const driver = await driverService.registerDriver({
          name: "John",
        });

        const result = await driverService.updateDriver(driver.driver.id, {
          name: "Paul",
        });

        expect(result).toEqual({
          ok: true,
          driver: {
            id: driver.driver.id,
            name: "Paul",
          },
        });
      });
      test("should not update bad input", async () => {
        const driver = await driverService.registerDriver({
          name: "John",
        });

        const result = await driverService.updateDriver(driver.driver.id, {
          name: "Paul",
          foo: "Bad",
        });

        expect(result.driver).not.toHaveProperty("foo");
      });

      test("should not update if there is no data to update", async () => {
        const driver = await driverService.registerDriver({
          name: "John",
        });

        const result = await driverService.updateDriver(driver.driver.id, {});

        expect(result).toEqual({
          ok: false,
          why: "invalid-data-to-update",
          status: 403,
        });
      });

      test("should return {ok:false, why:no-driver-found} if there is no driver with that id", async () => {
        await driverService.registerDriver({
          name: "John",
        });

        const result = await driverService.updateDriver(123, {
          name: "Paul",
        });

        expect(result).toEqual({
          ok: false,
          why: "no-driver-found",
          status: 404,
        });
      });

      describe("deleteDriver", () => {
        test("should delete a driver", async () => {
          const driver = await driverService.registerDriver({
            name: "John",
          });

          const result = await driverService.deleteDriver(driver.driver.id);

          expect(result).toBeUndefined();
          expect(
            await repositoryFaker.getById(driver.driver.id),
          ).toBeUndefined();
        });

        test("should return {ok:false, why:invalid-id} if there is no id", async () => {
          await driverService.registerDriver({
            name: "John",
          });

          const result = await driverService.deleteDriver();

          expect(result).toEqual({
            ok: false,
            why: "invalid-id",
            status: 403,
          });
        });
      });
    });
  });
});
