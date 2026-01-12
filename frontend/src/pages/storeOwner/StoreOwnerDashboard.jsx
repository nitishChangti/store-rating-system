import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice.js";
import { authService } from "../../services/auth.js";

import ProfileDetails from "../../components/ProfileDetails.jsx";
import { UpdatePassword, StoreOverview } from "../../components/index.js";

export default function StoreOwnerDashboard() {
  const [activeSection, setActiveSection] = useState("store");
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await authService.UserLogOut();
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
       <aside className="w-64 bg-white shadow-md p-6 flex flex-col">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Store Owner
        </h2>

        <nav className="space-y-1 flex-1">
              <SidebarButton
            label="Store Overview"
            active={activeSection === "store"}
            onClick={() => {
              setActiveSection("store");
              setProfileOpen(false);
            }}
          />

          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setActiveSection("profile-details");
            }}
            className={`w-full text-left rounded-md px-3 py-2 flex justify-between items-center ${
              profileOpen
                ? "bg-indigo-100 text-indigo-600"
                : "text-gray-700 hover:bg-indigo-50"
            }`}
          >
            Profile
            <span className="text-sm">{profileOpen ? "▾" : "▸"}</span>
          </button>

          {profileOpen && (
            <div className="ml-4 space-y-1">
              <SubButton
                label="Profile Details"
                active={activeSection === "profile-details"}
                onClick={() => setActiveSection("profile-details")}
              />

              <SubButton
                label="Update Password"
                active={activeSection === "update-password"}
                onClick={() => setActiveSection("update-password")}
              />
            </div>
          )}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-6 w-full text-left rounded-md px-3 py-2 text-red-600 hover:bg-red-50"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8">
        {activeSection === "store" && <StoreOverview />}
        {activeSection === "profile-details" && <ProfileDetails />}
        {activeSection === "update-password" && <UpdatePassword />}
      </main>
    </div>
  );
}

function SidebarButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-md px-3 py-2 ${
        active
          ? "bg-indigo-100 text-indigo-600"
          : "text-gray-700 hover:bg-indigo-50"
      }`}
    >
      {label}
    </button>
  );
}

function SubButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-md px-3 py-2 text-sm ${
        active
          ? "bg-indigo-50 text-indigo-600"
          : "text-gray-600 hover:bg-indigo-50"
      }`}
    >
      {label}
    </button>
  );
}
