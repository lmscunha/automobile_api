import { AutomobileUsage } from "./AutomobileUsageModel";
import { StorageDTO, UpdateDTO } from "./automobile-usage-dtos";

export interface AutomobileUsageProvider {
  getAll: () => Promise<AutomobileUsage[] | []>;
  isValidDriver: (driverId: string) => Promise<boolean>;
  save: (automobileUsage: StorageDTO) => Promise<AutomobileUsage>;
  update: (
    id: string,
    param: UpdateDTO,
  ) => Promise<AutomobileUsage | null | boolean>;
}
