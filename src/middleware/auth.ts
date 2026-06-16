import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { ROLE } from "../types";

const auth = (...roles: ROLE[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access!!",
        });
      }

      const decode = jwt.verify(
        token,
        config.access_secret as string,
      ) as JwtPayload;

      const userdata = await pool.query(
        `
                SELECT * FROM users WHERE email=$1`,
        [decode.email],
      );

      const user = userdata.rows[0];

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found!",
        });
      }

      if(roles.length&&!roles.includes(user.role)){
         return res.status(403).json({
          success: false,
          message: "Forbidden!!,This role have no access!",
        });
      }


      req.user=decode
      next()
    } catch (error) {
        next(error)
    }
  };
};
