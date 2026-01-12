import { pool } from "../db/index.js";

const updateStoreRatings = async (userId, storeId, rating) => {
  await pool.query(
    `
    INSERT INTO ratings (user_id, store_id, rating)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, store_id)
    DO UPDATE SET rating = $3
    `,
    [userId, storeId, rating]
  );
};

const avgStoreRating = async (storeId) => {
  const avgResult = await pool.query(
    `
    SELECT AVG(rating)::numeric(2,1) AS avg
    FROM ratings
    WHERE store_id = $1
    `,
    [storeId]
  );

  const avgRating = avgResult.rows[0].avg || 0;

  await pool.query(
    `UPDATE stores SET rating = $1 WHERE id = $2`,
    [avgRating, storeId]
  );

  return avgRating;
};

export {
    avgStoreRating,
    updateStoreRatings
} 