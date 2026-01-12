import { pool } from "../db/index.js";

const fetchStoreOwners = async () => {
  const result = await pool.query(`SELECT id, name, email
       FROM users
       WHERE role = 'store_owner'
       ORDER BY name ASC`);

  return result.rows;
};

const createStore = async ({ name, email, address, owner_id }) => {
  const result = await pool.query(
    `
    INSERT INTO stores (name, email, address, owner_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, address, owner_id
    `,
    [name, email, address, owner_id]
  );

  return result.rows[0];
};

const storeEmailExists = async (email) => {
  const result = await pool.query("SELECT id FROM stores WHERE email = $1", [
    email,
  ]);
  return result.rows.length > 0;
};

const storeOwnerExists = async (owner_id) => {
  const result = await pool.query(
    "SELECT id FROM users WHERE id = $1 AND role = 'store_owner'",
    [owner_id]
  );
  return result.rows.length > 0;
};

const fetchStores = async () => {
  const result = await pool.query(`
    SELECT
      s.id,
      s.name,
      s.email,
      s.address,
      ROUND(AVG(r.rating), 1) AS rating
    FROM stores s
    LEFT JOIN ratings r ON r.store_id = s.id
    GROUP BY s.id
    ORDER BY s.name ASC
  `);

  return result.rows.map(store => ({
    ...store,
    rating: store.rating ?? "Not Rated"
  }));
};

const fetchSingleStores = async (storeId, userId) => {
  const result = await pool.query(
    `
    SELECT
      s.id,
      s.name,
      s.address,
      s.rating,
      r.rating AS "userRating"
    FROM stores s
    LEFT JOIN ratings r
      ON r.store_id = s.id
     AND r.user_id = $2
    WHERE s.id = $1
    `,
    [storeId, userId]
  );
  return result.rows[0];
};

export {
  fetchStoreOwners,
  createStore,
  storeEmailExists,
  storeOwnerExists,
  fetchStores,
  fetchSingleStores
};
