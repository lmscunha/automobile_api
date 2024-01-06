import { v4 as uuidv4 } from "uuid";

import { Driver } from "../domain/DriverModel";
import { DriverProvider } from "../domain/driver-protocols";
import { FilterDTO, InputDTO, StorageDTO } from "../domain/driver-dtos";

let db: Driver[] = [];

export class DriverRepository implements DriverProvider {
  private async filterDrivers(
    filterFunction: (driver: Driver) => boolean,
  ): Promise<Driver[]> {
    return db.filter(filterFunction);
  }

  public async getAll(): Promise<Driver[] | []> {
    return db;
  }

  public async getById(id: string): Promise<Driver> {
    const [driver] = await this.filterDrivers((driver) => driver.id === id);
    return driver;
  }

  public async filterBy(params: FilterDTO): Promise<Driver[] | []> {
    let drivers: Driver[] | [] = db;
    for (const property in params) {
      drivers = await this.filterDrivers(
        (driver) =>
          driver[property as keyof Driver] ==
          params[property as keyof FilterDTO],
      );
    }

    return drivers;
  }

  public async save(driver: StorageDTO): Promise<Driver> {
    const id = uuidv4();
    const { name } = driver;

    db.push({ id, name });
    return { id, name };
  }

  public async update(id: string, newData: InputDTO): Promise<Driver | null> {
    const [driver] = await this.filterDrivers((driver) => driver.id === id);

    if (driver) {
      return Object.assign(driver, newData);
    }

    return null;
  }

  public async delete(id: string): Promise<void> {
    db = await this.filterDrivers((driver) => driver.id !== id);
  }
}
