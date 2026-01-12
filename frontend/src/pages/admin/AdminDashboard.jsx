import { useEffect, useState } from "react";
import {
  AddUser,
  CreateStore,
  ManageUsers,
  ManageStores,
} from "../../components";
import { adminService } from "../../services/admin";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("dashboard");

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getDashboardStats();
        setStats(res.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = async () => {
    await adminService.adminLogOut();
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col">
        <h2 className="text-lg font-semibold mb-6">Admin Panel</h2>

        <nav className="space-y-2 flex-1">
          {[
            ["dashboard", "Dashboard"],
            ["add-user", "Add New User"],
            ["create-store", "Create Store"],
            ["manage-users", "Manage Users"],
            ["manage-stores", "Manage Stores"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`w-full text-left rounded-md px-3 py-2 ${
                activeSection === key
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-gray-700 hover:bg-indigo-50"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="text-left rounded-md px-3 py-2 text-red-600 hover:bg-red-50"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8">
        {activeSection === "dashboard" && (
          <>
            <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Stat label="Total Users" value={stats.totalUsers} />
              <Stat label="Total Stores" value={stats.totalStores} />
              <Stat label="Total Ratings" value={stats.totalRatings} />
            </div>
          </>
        )}

        {activeSection === "add-user" && <AddUser />}
        {activeSection === "create-store" && <CreateStore />}
        {activeSection === "manage-users" && <ManageUsers />}
        {activeSection === "manage-stores" && <ManageStores />}
      </main>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-indigo-600">{value}</p>
    </div>
  );
}
