import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({
  connectionString: config.connection_string,
});

export const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      photo_url TEXT,
      password TEXT NOT NULL,
      role VARCHAR(20) NOT NULL, 
      coins INT DEFAULT 0,       
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
)
    `);

    // ২. TASKS TABLE 
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      detail TEXT NOT NULL,
      required_workers INT NOT NULL,
      payable_amount INT NOT NULL, 
      completion_date DATE NOT NULL,
      submission_info TEXT NOT NULL, 
      image_url TEXT,
      buyer_id INT REFERENCES users(id) ON DELETE CASCADE, 
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // ৩. SUBMISSIONS TABLE 
  await pool.query(`
    CREATE TABLE IF NOT EXISTS submissions (
      id SERIAL PRIMARY KEY,
      task_id INT REFERENCES tasks(id) ON DELETE CASCADE,
      worker_id INT REFERENCES users(id) ON DELETE CASCADE,
      buyer_id INT REFERENCES users(id) ON DELETE CASCADE,
      submission_details TEXT NOT NULL, 
      status VARCHAR(20) DEFAULT 'pending', 
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // ৪. WITHDRAWALS TABLE 
  await pool.query(`
    CREATE TABLE IF NOT EXISTS withdrawals (
      id SERIAL PRIMARY KEY,
      worker_id INT REFERENCES users(id) ON DELETE CASCADE,
      coin_to_withdraw INT NOT NULL,
      withdraw_amount_dollars NUMERIC(10, 2) NOT NULL, 
      payment_system VARCHAR(50) NOT NULL, 
      account_number VARCHAR(50) NOT NULL,
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // ৫. NOTIFICATIONS TABLE 
  await pool.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      message TEXT NOT NULL, -- "you have earned 3 coins..."
      to_email VARCHAR(100) NOT NULL, 
      action_route VARCHAR(100) NOT NULL, 
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
};
