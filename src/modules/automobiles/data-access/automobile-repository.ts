import { v4 as uuidv4 } from "uuid";

import { Automobile } from "../domain/AutomobileModel";
import { AutomobileProvider } from "../domain/automobile-protocols";
import { FilterDTO, InputDTO, StorageDTO } from "../domain/automobile-dtos";

let db: Automobile[] = [];

export class AutomobileRepository implements AutomobileProvider {
  public async getAll(): Promise<Automobile[] | []> {
    return db;
  }

  public async getById(id: string): Promise<Automobile | null> {
    return db.find((auto) => auto.id === id) || null;
  }

  public async filterBy(params: FilterDTO): Promise<Automobile[] | []> {
    let automobiles: Automobile[] | [] = db;
    for (const property in params) {
      automobiles = automobiles.filter(
        (auto) =>
          auto[property as keyof Automobile] ==
          params[property as keyof FilterDTO],
      );
    }

    return automobiles;
  }

  public async isValidPlate(licensePlate: string): Promise<boolean> {
    return !db.find((auto) => auto.licensePlate === licensePlate);
  }

  public async save(automobile: StorageDTO): Promise<Automobile> {
    const id = uuidv4();
    const newAutomobile = { id, ...automobile };
    db.push(newAutomobile);
    return newAutomobile;
  }

  public async update(
    id: string,
    newData: InputDTO,
  ): Promise<Automobile | null> {
    const automobile = db.find((auto) => auto.id === id);
    if (automobile) {
      Object.assign(automobile, newData);
      return automobile;
    }

    return null;
  }

  public async delete(id: string): Promise<void> {
    db = db.filter((auto) => auto.id !== id);
  }
}
