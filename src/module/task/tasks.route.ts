import { Router } from "express";
import { taskController } from "./tasks.controller";

const route = Router();

route.post("/", taskController.addTask);

route.get("", taskController.allAvailableTask);

route.get("",taskController.myTask)

route.delete("",taskController.deleteTask)
