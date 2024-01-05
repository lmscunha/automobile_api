const {
  AutomobileRepositoryFaker,
} = require("../../../automobiles/data-access/automobile-fake-repository");
const {
  DriverRepositoryFaker,
} = require("../../../drivers/data-access/driver-fake-repository");
const {
  AutomobileUsageRepositoryFaker,
} = require("../../data-access/automobile-usage-fake-repository");
const {
  AutomobileUsageService,
} = require("../../domain/automobile-usage-service");

const repositoryFaker = new AutomobileUsageRepositoryFaker();
const automobileRepositoryFaker = new AutomobileRepositoryFaker();
const driverRepositoryFaker = new DriverRepositoryFaker();
const automobileUsageService = new AutomobileUsageService(
  repositoryFaker,
  automobileRepositoryFaker,
  driverRepositoryFaker,
);

describe("AutomobileUsageService", () => {
  afterEach(async () => {
    await repositoryFaker.reset();
  });

  describe("getAllUsages", () => {
    test("should return [] if no automobile usage was registered", async () => {
      const result = await automobileUsageService.getAllAutomobileUsages({});

      expect(result).toEqual({ ok: true, automobileUsage: [] });
    });

    test("should return all automobileUsage", async () => {
      const driver = await driverRepositoryFaker.save({
        name: "John",
      });

      const automobile = await automobileRepositoryFaker.save({
        licensePlate: "AAA1A11",
        brand: "Foo",
        color: "Blue",
      });

      const driver2 = await driverRepositoryFaker.save({
        name: "Doe",
      });

      const autombile2 = await automobileRepositoryFaker.save({
        licensePlate: "AAA1A12",
        brand: "Foo",
        color: "Red",
      });

      await automobileUsageService.registerAutomobileUsage({
        startDate: "11/12/23",
        driverId: driver.id,
        automobileId: automobile.id,
        reason: "Test",
      });

      await automobileUsageService.registerAutomobileUsage({
        startDate: "12/12/23",
        driverId: driver2.id,
        automobileId: autombile2.id,
        reason: "Test 2",
      });

      const result = await automobileUsageService.getAllAutomobileUsages({});

      expect(result.automobileUsage.length).toEqual(2);
    });
  });

  describe("registerAUsage", () => {
    test("should register an automobile Usage", async () => {
      const driver = await driverRepositoryFaker.save({
        name: "John",
      });

      const automobile = await automobileRepositoryFaker.save({
        licensePlate: "AAA1A11",
        brand: "Foo",
        color: "Blue",
      });

      const result = await automobileUsageService.registerAutomobileUsage({
        startDate: "11/12/23",
        driverId: driver.id,
        automobileId: automobile.id,
        reason: "Test",
      });

      expect(result).toEqual({
        ok: true,
        automobileUsage: {
          startDate: "11/12/23",
          driver: {
            id: driver.id,
            name: "John",
          },
          automobile: {
            id: automobile.id,
            licensePlate: "AAA1A11",
            brand: "Foo",
            color: "Blue",
          },
          id: result.automobileUsage.id,
          reason: "Test",
        },
      });
    });

    test("should not register if date has invalid format", async () => {
      const driver = await driverRepositoryFaker.save({
        name: "John",
      });

      const automobile = await automobileRepositoryFaker.save({
        licensePlate: "AAA1A11",
        brand: "Foo",
        color: "Blue",
      });

      const result = await automobileUsageService.registerAutomobileUsage({
        startDate: "1111111",
        driverId: driver.id,
        automobileId: automobile.id,
        reason: "Test",
      });

      expect(result).toEqual({
        ok: false,
        why: "invalid-date-format",
        status: 403,
      });
    });

    test("should return {ok:false, why:invalid-automobile-usage-data} if all data is missing", async () => {
      const result = await automobileUsageService.registerAutomobileUsage({});

      expect(result).toEqual({
        ok: false,
        why: "invalid-automobile-usage-data",
        status: 403,
      });
    });

    test("should return {ok:false, why:invalid-automobile-data} if the automobile is missing", async () => {
      const result = await automobileUsageService.registerAutomobileUsage({});

      expect(result).toEqual({
        ok: false,
        why: "invalid-automobile-usage-data",
        status: 403,
      });
    });

    test("should return {ok:false, why:driver-already-has-a-usage} if a driver tries to use more than one automobile", async () => {
      const driver = await driverRepositoryFaker.save({
        name: "John",
      });

      const automobile = await automobileRepositoryFaker.save({
        licensePlate: "AAA1A11",
        brand: "Foo",
        color: "Blue",
      });

      await automobileUsageService.registerAutomobileUsage({
        startDate: "11/12/23",
        driverId: driver.id,
        automobileId: automobile.id,
        reason: "Test",
      });

      const result = await automobileUsageService.registerAutomobileUsage({
        startDate: "12/12/23",
        driverId: driver.id,
        automobileId: automobile.id,
        reason: "Test 2",
      });

      expect(result).toEqual({
        ok: false,
        why: "invalid-driver-already-has-a-usage",
        status: 403,
      });
    });

    test("should register an automobile Usage if all drivers usage were done", async () => {
      const driver = await driverRepositoryFaker.save({
        name: "John",
      });

      const automobile = await automobileRepositoryFaker.save({
        licensePlate: "AAA1A11",
        brand: "Foo",
        color: "Blue",
      });

      const autoUsage = await automobileUsageService.registerAutomobileUsage({
        startDate: "11/12/23",
        driverId: driver.id,
        automobileId: automobile.id,
        reason: "Test",
      });

      await automobileUsageService.updateAutomobileUsage(
        autoUsage.automobileUsage.id,
        {
          endDate: "15/12/23",
        },
      );

      const result = await automobileUsageService.registerAutomobileUsage({
        startDate: "16/12/23",
        driverId: driver.id,
        automobileId: automobile.id,
        reason: "Test 2",
      });

      expect(result).toEqual({
        ok: true,
        automobileUsage: {
          startDate: "16/12/23",
          driver: {
            id: driver.id,
            name: "John",
          },
          automobile: {
            id: automobile.id,
            licensePlate: "AAA1A11",
            brand: "Foo",
            color: "Blue",
          },
          id: result.automobileUsage.id,
          reason: "Test 2",
        },
      });
    });

    test("should not register bad input", async () => {
      const driver = await driverRepositoryFaker.save({
        name: "John",
      });

      const automobile = await automobileRepositoryFaker.save({
        licensePlate: "AAA1A11",
        brand: "Foo",
        color: "Blue",
      });

      const result = await automobileUsageService.registerAutomobileUsage({
        startDate: "11/12/23",
        driverId: driver.id,
        automobileId: automobile.id,
        reason: "Test",
        foo: "Bad input",
      });

      expect(result).toEqual({
        ok: true,
        automobileUsage: {
          startDate: "11/12/23",
          driver: {
            id: driver.id,
            name: "John",
          },
          automobile: {
            id: automobile.id,
            licensePlate: "AAA1A11",
            brand: "Foo",
            color: "Blue",
          },
          id: result.automobileUsage.id,
          reason: "Test",
        },
      });
    });
  });

  describe("updateDriver", () => {
    test("should update an automobile usage", async () => {
      const driver = await driverRepositoryFaker.save({
        name: "John",
      });

      const automobile = await automobileRepositoryFaker.save({
        licensePlate: "AAA1A11",
        brand: "Foo",
        color: "Blue",
      });

      const autoUsage = await automobileUsageService.registerAutomobileUsage({
        startDate: "11/12/23",
        driverId: driver.id,
        automobileId: automobile.id,
        reason: "Test",
      });

      const result = await automobileUsageService.updateAutomobileUsage(
        autoUsage.automobileUsage.id,
        {
          endDate: "15/12/23",
        },
      );

      expect(result).toEqual({
        ok: true,
        automobileUsage: {
          startDate: "11/12/23",
          endDate: "15/12/23",
          id: result.automobileUsage.id,
          driver: {
            name: "John",
            id: driver.id,
          },
          automobile: {
            id: automobile.id,
            licensePlate: "AAA1A11",
            brand: "Foo",
            color: "Blue",
          },
          reason: "Test",
        },
      });
    });

    test("should not update if there is no data to update", async () => {
      const driver = await driverRepositoryFaker.save({
        name: "John",
      });

      const automobile = await automobileRepositoryFaker.save({
        licensePlate: "AAA1A11",
        brand: "Foo",
        color: "Blue",
      });

      const autoUsage = await automobileUsageService.registerAutomobileUsage({
        startDate: "11/12/23",
        driverId: driver.id,
        automobileId: automobile.id,
        reason: "Test",
      });

      const result = await automobileUsageService.updateAutomobileUsage(
        autoUsage.automobileUsage.id,
        {},
      );

      expect(result).toEqual({
        ok: false,
        why: "invalid-date-format",
        status: 403,
      });
    });

    test("should return {ok:false, why:no-automobile-usage-found} if there is no automobile usage with that id", async () => {
      const driver = await driverRepositoryFaker.save({
        name: "John",
      });

      const automobile = await automobileRepositoryFaker.save({
        licensePlate: "AAA1A11",
        brand: "Foo",
        color: "Blue",
      });

      await automobileUsageService.registerAutomobileUsage({
        startDate: "11/12/23",
        driverId: driver.id,
        automobileId: automobile.id,
        reason: "Test",
      });

      const result = await automobileUsageService.updateAutomobileUsage(123, {
        endDate: "15/12/23",
      });

      expect(result).toEqual({
        ok: false,
        why: "no-automobile-usage-found",
        status: 404,
      });
    });

    test("should return {ok:false, why:invalid-end-date} if endDate is less then startDate", async () => {
      const driver = await driverRepositoryFaker.save({
        name: "John",
      });

      const automobile = await automobileRepositoryFaker.save({
        licensePlate: "AAA1A11",
        brand: "Foo",
        color: "Blue",
      });

      const autoUsage = await automobileUsageService.registerAutomobileUsage({
        startDate: "11/12/23",
        driverId: driver.id,
        automobileId: automobile.id,
        reason: "Test",
      });

      const result = await automobileUsageService.updateAutomobileUsage(
        autoUsage.automobileUsage.id,
        {
          endDate: "10/12/23",
        },
      );

      expect(result).toEqual({
        ok: false,
        why: "invalid-end-date",
        status: 403,
      });
    });

    test("should not update if date has invalid format", async () => {
      const driver = await driverRepositoryFaker.save({
        name: "John",
      });

      const automobile = await automobileRepositoryFaker.save({
        licensePlate: "AAA1A11",
        brand: "Foo",
        color: "Blue",
      });

      const autoUsage = await automobileUsageService.registerAutomobileUsage({
        startDate: "11/12/23",
        driverId: driver.id,
        automobileId: automobile.id,
        reason: "Test",
      });

      const result = await automobileUsageService.updateAutomobileUsage(
        autoUsage.automobileUsage.id,
        {
          endDate: "0000000",
        },
      );

      expect(result).toEqual({
        ok: false,
        why: "invalid-date-format",
        status: 403,
      });
    });

    test("should not update bad input", async () => {
      const driver = await driverRepositoryFaker.save({
        name: "John",
      });

      const automobile = await automobileRepositoryFaker.save({
        licensePlate: "AAA1A11",
        brand: "Foo",
        color: "Blue",
      });

      const autoUsage = await automobileUsageService.registerAutomobileUsage({
        startDate: "11/12/23",
        driverId: driver.id,
        automobileId: automobile.id,
        reason: "Test",
      });

      const result = await automobileUsageService.updateAutomobileUsage(
        autoUsage.automobileUsage.id,
        {
          foo: "Test",
        },
      );

      expect(result).toEqual({
        ok: false,
        why: "invalid-date-format",
        status: 403,
      });
    });
  });
});
