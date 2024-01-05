import { InputDTO, ResultDTO, UpdateDTO } from "./automobile-usage-dtos";

export interface AutomobileUsageUseCases {
  getAllAutomobileUsages: () => Promise<ResultDTO | []>;
  registerAutomobileUsage: (autombileUsage: InputDTO) => Promise<ResultDTO>;
  updateAutomobileUsage: (id: string, param: UpdateDTO) => Promise<ResultDTO>;
}
