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

const allAvailableTask = async (req: Request, res: Response) => {
  try {
    const result = await taskService.allAvailableTaskInToDb();
    res.status(200).json({
      success: true,
      message: "Data Fetched successfully!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: true,
      message: "Failed to load data",
      data: [],
    });
  }
};

const deleteTask = async (req: Request, res: Response) => {
  try {
    const buyer_id: number = req.user?.id;

    const { id } = req.body;
    const result = await taskService.deleteTaskInToDb(id as number, buyer_id);
    res.status(201).json({
      success: true,
      message: "Data Deleted successfully!",
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Failed to Delete data",
      data: [],
    });
  }
};



const myTask = async (req: Request, res: Response) => {
  try {
    const id: number = req.user?.id;
    const result = await taskService.myTaskInToDb(id);
    res.status(200).json({
      success: true,
      message: "Data Fetched successfully!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load data",
      data: [],
    });
  }
};

export const taskController = { addTask, allAvailableTask, myTask,deleteTask };
