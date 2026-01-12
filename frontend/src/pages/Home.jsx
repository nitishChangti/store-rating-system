import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { Header } from "../components";
import { authService } from "../services/auth.js";

export default function Home() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("name-asc");

  useEffect(() => {
    async function fetchStores() {
      try {
        const res = await authService.getAllStores();
        setStores(res?.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch stores");
      } finally {
        setLoading(false);
      }
    }

    fetchStores();
  }, []);

  const finalStores = useMemo(() => {
    let result = stores.filter(
      (store) =>
        store.name.toLowerCase().includes(search.toLowerCase()) ||
        store.address.toLowerCase().includes(search.toLowerCase())
    );

    switch (sortBy) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "rating-high":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "rating-low":
        result.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
      default:
        break;
    }

    return result;
  }, [stores, search, sortBy]);

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <div className="mx-auto max-w-4xl px-4 py-8 flex gap-4">
        <input
          type="text"
          placeholder="Search stores by name or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border px-4 py-3"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-lg border px-3 py-3"
        >
          <option value="name-asc">Name (A–Z)</option>
          <option value="name-desc">Name (Z–A)</option>
          <option value="rating-high">Rating (High → Low)</option>
          <option value="rating-low">Rating (Low → High)</option>
        </select>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-10">
        {loading ? (
          <p className="text-center text-gray-500">Loading stores...</p>
        ) : finalStores.length === 0 ? (
          <p className="mt-10 text-center text-gray-500">
            No stores found.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {finalStores.map((store) => (
              <div
                key={store.id}
                className="rounded-xl bg-white p-5 shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {store.name}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {store.address}
                </p>

                <p className="mt-3 text-sm text-yellow-600">
                  ⭐ {Number(store.rating || 0).toFixed(1)}
                </p>

                <button
                  onClick={() => navigate(`/store/${store.id}`)}
                  className="mt-4 text-sm font-medium text-indigo-600 hover:underline"
                >
                  View Store
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
