import { Driver } from "../../drivers/domain/DriverModel";
import { Automobile } from "../../automobiles/domain/AutomobileModel";

export type AutomobileUsage = {
  id: string;
  startDate: string;
  endDate?: string;
  driver: Driver;
  automobile: Automobile;
  reason: string;
};
