import { Driver } from "./DriverModel";
import { StorageDTO, InputDTO, FilterDTO } from "./driver-dtos";

export interface DriverProvider {
  getAll: () => Promise<Driver[] | []>;
  filterBy: (params: FilterDTO) => Promise<Driver[] | []>;
  getById: (id: string) => Promise<Driver>;
  save: (driver: StorageDTO) => Promise<Driver>;
  update: (id: string, driver: InputDTO) => Promise<Driver | null>;
  delete: (id: string) => Promise<void>;
}
