import { Request, Response } from "express";

import { DriverService } from "../domain/driver-service";
import { DriverRepository } from "../data-access/driver-repository";

const driverService = new DriverService(new DriverRepository());

export default class DriverController {
  public async list(req: Request, res: Response): Promise<Response> {
    const query = req.query;
    let data = await driverService.getAllDrivers(query);

    return res.status(200).json({ data });
  }

  public async load(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const data = await driverService.getADriver(id);
    if (!data.ok) {
      return res.status(Number(data.status)).json({ message: data.why });
    }

    return res.status(200).json({ data });
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { name } = req.body;

    const data = await driverService.registerDriver({
      name,
    });

    if (!data.ok) {
      return res.status(Number(data.status)).json({ message: data.why });
    }

    return res.status(201).json({ data });
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const body = req.body;

    const data = await driverService.updateDriver(id, body);

    if (!data.ok) {
      return res.status(Number(data.status)).json({ message: data.why });
    }

    return res.status(200).json({ data });
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    await driverService.deleteDriver(id);

    return res.status(204).json();
  }
}
