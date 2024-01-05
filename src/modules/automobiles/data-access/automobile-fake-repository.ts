import { v4 as uuidv4 } from "uuid";

import { Automobile } from "../domain/AutomobileModel";
import { AutomobileProvider } from "../domain/automobile-protocols";
import { FilterDTO, InputDTO, StorageDTO } from "../domain/automobile-dtos";

let db: Automobile[] = [];

export class AutomobileRepositoryFaker implements AutomobileProvider {
  public async getAll(): Promise<Automobile[] | []> {
    const automobiles = db;
    return automobiles;
  }

  public async getById(id: string): Promise<Automobile> {
    let automobile = db.filter((auto) => auto.id === id);
    return automobile[0];
  }

  public async isValidPlate(licensePlate: string): Promise<boolean> {
    let result = false;
    let automobile = db.filter((auto) => auto.licensePlate === licensePlate);

    if (automobile.length === 0) {
      result = true;
    }

    return result;
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

  public async save(automobile: StorageDTO): Promise<Automobile> {
    const id = uuidv4();

    const { licensePlate, color, brand } = automobile;

    db.push({ id, licensePlate, color, brand });
    return { id, licensePlate, color, brand };
  }

  public async update(
    id: string,
    newData: InputDTO,
  ): Promise<Automobile | null> {
    let automobile: Automobile | null = null;

    db.forEach((auto) => {
      if (auto.id === id) {
        auto = Object.assign(auto, newData);
        automobile = auto;
      }
    });

    return automobile;
  }

  public async delete(id: string): Promise<void> {
    const newDB = db.filter((auto) => auto.id !== id);
    db = newDB;
  }

  public async reset(): Promise<void> {
    db = [];
  }
}
