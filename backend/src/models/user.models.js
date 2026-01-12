import { pool } from "../db/index.js";

const createUser = async ({ name, email, address, password, role }) => {
  const query = `
    INSERT INTO users (name, email, address, password, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, role
    `;
  const values = [name, email, address, password, role];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};

const findUserById = async (id) => {
  const { rows } = await pool.query(
    `SELECT id, name, email, address, role FROM public.users WHERE id=$1`,
    [id]
  );
  return rows[0];
};

const updatePassword = async (userId, hashedPassword) => {
  await pool.query("UPDATE public.users SET password = $1 WHERE id = $2", [
    hashedPassword,
    userId,
  ]);
};

export { createUser, findUserByEmail, findUserById, updatePassword };
