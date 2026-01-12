import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "../components";
import { authService } from "../services/auth.js";

export default function StoreDetails() {
  const { storeId} = useParams();
  console.log(storeId);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!storeId) return;
    async function fetchStore() {
      try {
        const res = await authService.getStoreById(storeId);
        console.log(res);
        setStore(res.data.data);
      } catch (error) {
        console.error("Failed to fetch store");
      } finally {
        setLoading(false);
      }
    }

    fetchStore();
  }, [storeId]);

const handleRatingChange = async (rating) => {
  try {
    const res = await authService.submitRating(store.id, rating);

    setStore((prev) => ({
      ...prev,
      userRating: rating,
      rating: res.data.data.overallRating, 
    }));
  } catch (error) {
    console.error(error.message);
  }
};


  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!store) {
    return <p className="text-center mt-10">Store not found</p>;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800">
            {store.name}
          </h2>

          <p className="mt-1 text-gray-500">
            {store.address}
          </p>

          <div className="mt-6 space-y-2">
            <p>
              <strong>Overall Rating:</strong>{" "}
              ⭐ {Number(store.rating || 0).toFixed(1)}
            </p>

            <p>
              <strong>Your Rating:</strong>{" "}
              {store.userRating
                ? `⭐ ${store.userRating}`
                : "Not rated"}
            </p>
          </div>

          <div className="mt-6">
            <select
              value={store.userRating || 0}
              onChange={(e) =>
                handleRatingChange(Number(e.target.value))
              }
              className="w-full rounded-md border px-3 py-2"
            >
              <option value={0}>
                {store.userRating
                  ? "Modify Rating"
                  : "Submit Rating"}
              </option>
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>
                  {r} Star{r > 1 && "s"}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
