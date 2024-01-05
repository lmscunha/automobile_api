import { Router } from "express";

import DriverController from "./DriversController";

const driversRouter = Router();
const driverController = new DriverController();

driversRouter.get("/", driverController.list);
driversRouter.get("/:id", driverController.load);
driversRouter.post("/", driverController.create);
driversRouter.put("/:id", driverController.update);
driversRouter.delete("/:id", driverController.delete);

export default driversRouter;
