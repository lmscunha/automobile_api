import { v4 as uuidv4 } from "uuid";

import { AutomobileUsage } from "../domain/AutomobileUsageModel";
import { AutomobileUsageProvider } from "../domain/automobile-usage-protocols";
import { StorageDTO, UpdateDTO } from "../domain/automobile-usage-dtos";

let db: AutomobileUsage[] = [];

export class AutomobileUsageRepository implements AutomobileUsageProvider {
  private async filterUsage(
    filterFunction: (usage: AutomobileUsage) => boolean,
  ): Promise<AutomobileUsage[]> {
    return db.filter(filterFunction);
  }

  public async getAll(): Promise<AutomobileUsage[] | []> {
    return db;
  }

  public async isValidDriver(driverId: string): Promise<boolean> {
    let result = false;
    const isDriverUsingAnAuto = await this.filterUsage(
      (autoUsage) => autoUsage.driver.id === driverId && !autoUsage.endDate,
    );

    if (isDriverUsingAnAuto.length < 1) {
      result = true;
    }
    return result;
  }

  public async save(automobileUsage: StorageDTO): Promise<AutomobileUsage> {
    const id = uuidv4();

    const { startDate, driver, automobile, reason } = automobileUsage;

    db.push({ id, startDate, driver, automobile, reason });
    return { id, startDate, driver, automobile, reason };
  }

  public async update(
    id: string,
    newData: UpdateDTO,
  ): Promise<AutomobileUsage | boolean> {
    let automobileUsage: AutomobileUsage | null | boolean = null;

    let [usage] = await this.filterUsage((autoUsage) => autoUsage.id === id);
    automobileUsage =
      usage.startDate > newData.endDate ? false : Object.assign(usage, newData);
    if (automobileUsage) usage = automobileUsage;

    return automobileUsage;
  }
}
