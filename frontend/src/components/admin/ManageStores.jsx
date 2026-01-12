import { useEffect, useState } from "react";
import { adminService } from "../../services/admin";


function StoreDetails({ store, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Store Details</h3>

        <div className="space-y-2 text-gray-700">
          <p><strong>Name:</strong> {store.name}</p>
          <p><strong>Email:</strong> {store.email}</p>
          <p><strong>Address:</strong> {store.address}</p>
          <p><strong>Rating:</strong> {store.rating ?? "Not Rated"}</p>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}


export default function ManageStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });


  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await adminService.getAllStores();

        setStores(response.data.data);
      } catch (error) {
        console.error("Failed to fetch stores", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  let filteredStores = stores.filter((store) => {
    const text = search.toLowerCase();
    return (
      store.name.toLowerCase().includes(text) ||
      store.email.toLowerCase().includes(text) ||
      store.address.toLowerCase().includes(text)
    );
  });


  if (sortConfig.key) {
    filteredStores.sort((a, b) => {
      const aVal = a[sortConfig.key].toLowerCase();
      const bVal = b[sortConfig.key].toLowerCase();

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  if (loading) {
    return <p className="text-gray-600">Loading stores...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Manage Stores
      </h2>

      <input
        type="text"
        placeholder="Search by name, email, address"
        className="mb-4 w-full rounded-md border px-3 py-2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="w-full border-collapse">
          <thead className="bg-slate-100">
            <tr>
              <th
                className="border px-4 py-2 text-left cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name ⬍
              </th>
              <th
                className="border px-4 py-2 text-left cursor-pointer"
                onClick={() => handleSort("email")}
              >
                Email ⬍
              </th>
              <th className="border px-4 py-2 text-left">Address</th>
              <th className="border px-4 py-2 text-left">Rating</th>
              <th className="border px-4 py-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredStores.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-6 text-center text-gray-500">
                  No stores found
                </td>
              </tr>
            ) : (
              filteredStores.map((store) => (
                <tr key={store.id} className="hover:bg-slate-50">
                  <td className="border px-4 py-2">{store.name}</td>
                  <td className="border px-4 py-2">{store.email}</td>
                  <td className="border px-4 py-2">{store.address}</td>
                  <td className="border px-4 py-2">
                    {store.rating ?? "Not Rated"}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => setSelectedStore(store)}
                      className="text-indigo-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedStore && (
        <StoreDetails
          store={selectedStore}
          onClose={() => setSelectedStore(null)}
        />
      )}
    </div>
  );
}
