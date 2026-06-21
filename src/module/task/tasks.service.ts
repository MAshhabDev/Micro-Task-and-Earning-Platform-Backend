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

const allAvailableTaskInToDb = async () => {
  const result = await pool.query(
    `SELECT * FROM tasks WHERE required_workers > 0 ORDER BY id DESC`,
  );

  return result.rows;
};

const myTaskInToDb = async (buyer_id: number) => {
  const result = await pool.query(
    `SELECT * FROM tasks WHERE buyer_id = $1 ORDER BY id DESC`,
    [buyer_id],
  );

  return result.rows;
};

const deleteTaskInToDb = async (id:number,buyer_id: number) => {
  const taskData = await pool.query(
    `SELECT required_workers, payable_amount FROM tasks WHERE id = $1 AND buyer_id = $2 `,
    [id, buyer_id],
  );

  if(taskData.rows.length===0){
    throw new Error("Task not found or unauthorized!")
  }

  const{required_workers,payable_amount}=taskData.rows[0]

  const refill_amount=required_workers * payable_amount;


  await pool.query(`UPDATE users SET coins=coins+$1 WHERE id=$2`,[refill_amount, buyer_id])

  const result = await pool.query(`DELETE FROM tasks WHERE id=$1 AND buyer_id=$2 RETURNING *`, [
    id,buyer_id
  ]);

  return result.rows[0];
};

export const taskService = {
  addTaskInToDb,
  allAvailableTaskInToDb,
  myTaskInToDb,
  deleteTaskInToDb
};
