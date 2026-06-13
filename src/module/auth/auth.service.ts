import { pool } from "../../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config";

const signUpIntoDb = async (payload: any) => {
  const { name, email, password, role } = payload;
  let coins = 0;
  if (role === "worker") {
    coins = 10; 
  } else if (role === "buyer") {
    coins = 50; 
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (name,email,password,role,coins) VALUES($1,$2,$3,$4) RETURNING name,email,role,coins`,
    [name, email, hashPassword, role,coins],
  );
  return result.rows[0];
};

const signInIntoDB = async (payload: any) => {
  const { email, password } = payload;
  const userData = await pool.query(`SELECT * FROM users WHERE email=$1`,[email]);
  if (userData.rows.length === 0) {
    throw new Error("Invalid Credential");
  }

  const user = userData.rows[0];

  const matchPass = await bcrypt.compare(password, user.password);
  if (!matchPass) {
    throw new Error("Invalid Credential");
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.access_secret as string, {
    expiresIn: "1d",
  });

  return { accessToken };
};
export const authService = { signUpIntoDb, signInIntoDB };
