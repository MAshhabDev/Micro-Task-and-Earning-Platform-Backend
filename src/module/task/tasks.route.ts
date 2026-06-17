import { Router } from "express";
import { taskController } from "./tasks.controller";

const route = Router();

route.post("/", taskController.addTask);
