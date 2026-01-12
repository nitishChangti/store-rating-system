import { pool } from "../db/index.js";

const getStoreByOwnerId = async (ownerId) => {
  const result = await pool.query(
    `
    SELECT id, name, address, rating
    FROM stores
    WHERE owner_id = $1
    `,
    [ownerId]
  );

  return result.rows[0];
};

const getRatingsForStore = async (storeId) => {
  const result = await pool.query(
    `
    SELECT
      u.id AS user_id,
      u.name,
      u.email,
      r.rating,
      r.created_at
    FROM ratings r
    JOIN users u ON r.user_id = u.id
    WHERE r.store_id = $1
    ORDER BY r.created_at DESC
    `,
    [storeId]
  );

  return result.rows;
};

export {
  getStoreByOwnerId,
  getRatingsForStore
};
