import { Request, Response } from "express";

import { AutomobileService } from "../domain/automobile-service";
import { AutomobileRepository } from "../data-access/automobile-repository";

const automobileService = new AutomobileService(new AutomobileRepository());

export default class AutomobileController {
  public async list(req: Request, res: Response): Promise<Response> {
    const query = req.query;
    let data = await automobileService.getAllAutomobiles(query);

    return res.status(200).json({ data });
  }

  public async load(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const data = await automobileService.getAnAutomobile(id);
    if (!data.ok) {
      return res.status(Number(data.status)).json({ message: data.why });
    }

    return res.status(200).json({ data });
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { licensePlate, color, brand } = req.body;

    const data = await automobileService.registerAutomobile({
      licensePlate,
      color,
      brand,
    });

    if (!data.ok) {
      return res.status(Number(data.status)).json({ message: data.why });
    }

    return res.status(201).json({ data });
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const body = req.body;

    const data = await automobileService.updateAutomobile(id, body);

    if (!data.ok) {
      return res.status(Number(data.status)).json({ message: data.why });
    }

    return res.status(200).json({ data });
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    await automobileService.deleteAutomobile(id);

    return res.status(204).json();
  }
}
