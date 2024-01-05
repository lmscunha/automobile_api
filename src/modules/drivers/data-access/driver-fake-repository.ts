import { v4 as uuidv4 } from "uuid";

import { Driver } from "../domain/DriverModel";
import { DriverProvider } from "../domain/driver-protocols";
import { FilterDTO, InputDTO, StorageDTO } from "../domain/driver-dtos";

let db: Driver[] = [];

export class DriverRepositoryFaker implements DriverProvider {
  public async getAll(): Promise<Driver[] | []> {
    const drivers = db;
    return drivers;
  }

  public async getById(id: string): Promise<Driver> {
    let driver = db.filter((driver) => driver.id === id);
    return driver[0];
  }

  public async filterBy(params: FilterDTO): Promise<Driver[] | []> {
    let drivers: Driver[] | [] = db;

    for (const property in params) {
      drivers = drivers.filter(
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
    let driverUpdated: Driver | null = null;

    db.forEach((driver) => {
      if (driver.id === id) {
        driver = Object.assign(driver, newData);
        driverUpdated = driver;
      }
    });

    return driverUpdated;
  }

  public async delete(id: string): Promise<void> {
    const newDB = db.filter((driver) => driver.id !== id);
    db = newDB;
  }

  public async reset(): Promise<void> {
    db = [];
  }
}
