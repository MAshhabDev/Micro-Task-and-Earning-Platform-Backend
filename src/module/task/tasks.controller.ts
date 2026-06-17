import type { Request, Response } from "express";
import { taskService } from "./tasks.service";

const addTask = async (req: Request, res: Response) => {
  try {
    const coins: number = req.user?.id;
    const result = await taskService.addTaskInToDb(req.body, coins);

    res.status(201).json({
      success: true,
      message: "Task Created successfully!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: true,
      message: "Failed to add task",
      data: [],
    });
  }
};

export const taskController = { addTask };
