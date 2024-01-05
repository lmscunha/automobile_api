import { InputDTO, FilterDTO, ResultDTO } from "./automobile-dtos";

export interface AutomobileUseCases {
  getAllAutomobiles: (params: FilterDTO) => Promise<ResultDTO | []>;
  getAnAutomobile: (id: string) => Promise<ResultDTO>;
  registerAutomobile: (autombile: InputDTO) => Promise<ResultDTO>;
  updateAutomobile: (id: string, automobile: InputDTO) => Promise<ResultDTO>;
  deleteAutomobile: (id: string) => Promise<void | ResultDTO>;
}
