import { v4 as uuidv4 } from "uuid";

import { AutomobileUsage } from "../domain/AutomobileUsageModel";
import { AutomobileUsageProvider } from "../domain/automobile-usage-protocols";
import { StorageDTO, UpdateDTO } from "../domain/automobile-usage-dtos";

let db: AutomobileUsage[] = [];

export class AutomobileUsageFakeRepository implements AutomobileUsageProvider {
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
    let isDriverUsingAnAuto = db.filter(
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
  ): Promise<AutomobileUsage | null | boolean> {
    let automobileUsage: AutomobileUsage | null | boolean = null;

    let [autoUsage] = await this.filterUsage(
      (autoUsage) => autoUsage.id === id,
    );
    if (autoUsage?.id === id) {
      if (newData.endDate < autoUsage.startDate) {
        return (automobileUsage = false);
      }

      autoUsage = Object.assign(autoUsage, newData);
      automobileUsage = autoUsage;
    }

    return automobileUsage;
  }

  public async reset(): Promise<void> {
    db = [];
  }
}
