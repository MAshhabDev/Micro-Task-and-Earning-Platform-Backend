import { pool } from "../../db";
import bcrypt from "bcrypt";

const signUpIntoDb = async (payload: any) => {
  const { name, email, password, role } = payload;

  const hashPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (name,email,password,role) VALUES($1,$2,$3,$4) RETURNING name,email,role`,
    [name, email, hashPassword, role],
  );
 return result.rows[0];
};


const signInIntoDB=()=>{
    
}



export const authService = { signUpIntoDb };
