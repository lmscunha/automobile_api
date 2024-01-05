import { InputDTO, FilterDTO, ResultDTO } from "./driver-dtos";

export interface DriverUseCases {
  getAllDrivers: (params: FilterDTO) => Promise<ResultDTO | []>;
  getADriver: (id: string) => Promise<ResultDTO>;
  registerDriver: (driver: InputDTO) => Promise<ResultDTO>;
  updateDriver: (id: string, automobile: InputDTO) => Promise<ResultDTO>;
  deleteDriver: (id: string) => Promise<void | ResultDTO>;
}
