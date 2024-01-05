import { AutomobileUsage } from "./AutomobileUsageModel";
import { Automobile } from "../../automobiles/domain/AutomobileModel";
import { Driver } from "../../drivers/domain/DriverModel";

export type InputDTO = {
  id?: string;
  startDate?: string;
  endDate?: string;
  driverId?: string;
  automobileId?: string;
  reason?: string;
};

export type StorageDTO = {
  startDate: string;
  driver: Driver;
  automobile: Automobile;
  reason: string;
};

export type UpdateDTO = {
  endDate: string;
};

export type ResultDTO = {
  ok: boolean;
  why?: string;
  status?: number;
  automobileUsage?: AutomobileUsage | AutomobileUsage[] | boolean;
};
