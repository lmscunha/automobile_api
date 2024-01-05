import { Automobile } from "./AutomobileModel";
import { StorageDTO, InputDTO, FilterDTO } from "./automobile-dtos";

export interface AutomobileProvider {
  getAll: () => Promise<Automobile[] | []>;
  filterBy: (params: FilterDTO) => Promise<Automobile[] | []>;
  getById: (id: string) => Promise<Automobile>;
  isValidPlate: (licensePlate: string) => Promise<boolean>;
  save: (automobile: StorageDTO) => Promise<Automobile>;
  update: (id: string, automobile: InputDTO) => Promise<Automobile | null>;
  delete: (id: string) => Promise<void>;
}
