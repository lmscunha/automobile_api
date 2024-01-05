import { Driver } from "./DriverModel";

export type InputDTO = {
  id?: string;
  name?: string;
};

export type StorageDTO = {
  name: string;
};

export type FilterDTO = {
  name?: string;
};

export type ResultDTO = {
  ok: boolean;
  why?: string;
  status?: number;
  driver?: Driver | Driver[];
};
