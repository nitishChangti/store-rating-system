import { useEffect, useState } from "react";
import { storeOwnerService } from "../../services/storeOwner.js";

export default function StoreOverview() {
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log('store owner');
    async function fetchDashboard() {
      try {
        const data = await storeOwnerService.getDashboard();
        console.log('data for store owner',data);
        setStore(data.store);
        setRatings(data.ratings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [store]);

  if (loading) {
    return <p className="text-gray-500">Loading store overview...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Store Overview
      </h1>

      <div className="rounded-xl bg-white p-6 shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {store.name}
        </h2>
        <p className="text-sm text-gray-500">{store.address}</p>

        <p className="mt-3 text-lg font-medium text-yellow-600">
          ⭐ Average Rating: {Number(store.averageRating || 0).toFixed(1)}
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Users Who Rated
        </h3>

        {ratings.length === 0 ? (
          <p className="text-gray-500">No ratings submitted yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left text-sm text-gray-500">
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>Rating</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((r) => (
                <tr
                  key={r.user_id}
                  className="border-b text-sm text-gray-700"
                >
                  <td className="py-2">{r.name}</td>
                  <td>{r.email}</td>
                  <td className="text-yellow-600">⭐ {r.rating}</td>
                  <td>
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
