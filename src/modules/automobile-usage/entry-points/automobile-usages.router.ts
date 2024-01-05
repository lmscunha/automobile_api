import { Router } from "express";

import AutomobileUsageController from "./AutomobileUsagesController";

const automobileUsagesRouter = Router();
const automobileUsageController = new AutomobileUsageController();

automobileUsagesRouter.get("/", automobileUsageController.list);
automobileUsagesRouter.post("/", automobileUsageController.create);
automobileUsagesRouter.put("/:id", automobileUsageController.update);

export default automobileUsagesRouter;
