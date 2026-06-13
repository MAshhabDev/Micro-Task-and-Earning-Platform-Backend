import type { Request, Response } from "express";
import { authService } from "./auth.service";

const signUp = async (req: Request, res: Response) => {
  try {
    const result = await authService.signUpIntoDb(req.body);

    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "User registration failed!",
    });
  }
};

const signIn = async (req: Request, res: Response) => {
  try {
    const result = await authService.signInIntoDB(req.body);
    res.status(200).json({
      success: true,
      message: "User Login Successfully",
      data: result,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "User did not match",
    });
  }
};

export const authController = { signUp,signIn };
