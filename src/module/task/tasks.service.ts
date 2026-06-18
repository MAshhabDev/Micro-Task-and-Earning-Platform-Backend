import { pool } from "../../db";

const addTaskInToDb = async (payload: any, coins: number) => {
  const {
    buyer_id,
    title,
    detail,
    required_workers,
    payable_amount,
    completion_date,
    submission_info,
    image_url,
  } = payload;
  const total_cost = required_workers * payable_amount;

  if (total_cost > coins) {
    throw new Error("Not available Coin. Purchase Coin");
  }

  const userData = await pool.query(
    `UPDATE users SET coins=coins-$1 WHERE id=$2`,
    [total_cost, buyer_id],
  );

  const result = await pool.query(
    `INSERT INTO tasks ( title,
    detail,
    required_workers,
    payable_amount,
    completion_date,
    submission_info,
    image_url,buyer_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [
      title,
      detail,
      required_workers,
      payable_amount,
      completion_date,
      submission_info,
      image_url,
      buyer_id,
    ],
  );
  return result.rows[0];
};

const allAvailableTaskInToDb = async() => {
  const result = await pool.query(
    `SELECT * FROM tasks WHERE required_workers > 0 ORDER BY id DESC`,
  );

  return result.rows;
};
export const taskService = { addTaskInToDb,allAvailableTaskInToDb };
