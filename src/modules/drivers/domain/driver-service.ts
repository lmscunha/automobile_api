import { DriverUseCases } from "./driver-use-cases";
import { Driver } from "./DriverModel";
import { DriverProvider } from "./driver-protocols";
import { ResultDTO, FilterDTO, InputDTO } from "./driver-dtos";

export class DriverService implements DriverUseCases {
  constructor(public readonly driverProvider: DriverProvider) {}

  public async getAllDrivers(param: FilterDTO): Promise<ResultDTO> {
    let drivers: Driver[];

    if (Object.keys(param).length > 0) {
      drivers = await this.driverProvider.filterBy(param);
      return { ok: true, driver: drivers };
    }

    drivers = await this.driverProvider.getAll();
    return { ok: true, driver: drivers };
  }

  public async getADriver(id: string): Promise<ResultDTO> {
    const driver = await this.driverProvider.getById(id);

    if (!driver) {
      return {
        ok: false,
        why: "no-driver-found",
        status: 404,
      };
    }

    return { ok: true, driver };
  }

  public async registerDriver(driver: InputDTO): Promise<ResultDTO> {
    const { name } = driver;

    if (!name) {
      return { ok: false, why: "invalid-driver-data", status: 403 };
    }

    const result = await this.driverProvider.save({ name });
    return { ok: true, driver: result };
  }

  public async updateDriver(id: string, newData: InputDTO): Promise<ResultDTO> {
    const { name } = newData;

    if (!name) {
      return { ok: false, why: "invalid-data-to-update", status: 403 };
    }

    const driver = await this.driverProvider.update(id, { name });
    if (!driver) {
      return {
        ok: false,
        why: "no-driver-found",
        status: 404,
      };
    }

    return { ok: true, driver };
  }

  public async deleteDriver(id: string): Promise<void | ResultDTO> {
    if (!id) {
      return { ok: false, why: "invalid-id", status: 403 };
    }

    await this.driverProvider.delete(id);
  }
}
