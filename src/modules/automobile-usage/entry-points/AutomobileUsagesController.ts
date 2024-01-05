import { Request, Response } from "express";

import { AutomobileUsageService } from "../domain/automobile-usage-service";
import { AutomobileUsageRepository } from "../data-access/automobile-usage-repository";
import { DriverRepository } from "../../drivers/data-access/driver-repository";
import { AutomobileRepository } from "../../automobiles/data-access/automobile-repository";

const automobileUsageService = new AutomobileUsageService(
  new AutomobileUsageRepository(),
  new AutomobileRepository(),
  new DriverRepository(),
);

export default class AutomobileUsageController {
  public async list(req: Request, res: Response): Promise<Response> {
    let data = await automobileUsageService.getAllAutomobileUsages();

    return res.status(200).json({ data });
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { startDate, driverId, automobileId, reason } = req.body;

    const data = await automobileUsageService.registerAutomobileUsage({
      startDate,
      driverId,
      automobileId,
      reason,
    });

    if (!data.ok) {
      return res.status(Number(data.status)).json({ message: data.why });
    }

    return res.status(201).json({ data });
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const body = req.body;

    const data = await automobileUsageService.updateAutomobileUsage(id, body);

    if (!data.ok) {
      return res.status(Number(data.status)).json({ message: data.why });
    }

    return res.status(200).json({ data });
  }
}
