import { pool } from "../db/index.js";

const fetchAdminDashboardStats = async () => {
  const usersResult = await pool.query(
    "SELECT COUNT(*) FROM users"
  );

  const storesResult = await pool.query(
    "SELECT COUNT(*) FROM stores"
  );

  const ratingsResult = await pool.query(
    "SELECT COUNT(*) FROM ratings"
  );

  return {
    totalUsers: Number(usersResult.rows[0].count),
    totalStores: Number(storesResult.rows[0].count),
    totalRatings: Number(ratingsResult.rows[0].count),
  };
};

const fetchAllUsersForAdmin = async () => {
  const result = await pool.query(`
    SELECT
      u.id,
      u.name,
      u.email,
      u.address,
      u.role,
      ROUND(AVG(r.rating), 1) AS rating
    FROM users u
    LEFT JOIN stores s ON s.owner_id = u.id
    LEFT JOIN ratings r ON r.store_id = s.id
    GROUP BY u.id
    ORDER BY u.name ASC
  `);

  return result.rows;
};
export {
  fetchAdminDashboardStats,
  fetchAllUsersForAdmin
};
