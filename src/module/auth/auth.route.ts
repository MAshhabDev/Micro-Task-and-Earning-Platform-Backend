import { Router } from "express";
import { authController } from "./auth.controller";

const route = Router();


route.post("/",authController.signUp)

route.post("/",)