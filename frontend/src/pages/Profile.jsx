import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UpdatePassword, ProfileDetails } from "../components";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("details");
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto mt-10 flex gap-6">

      <div className="w-1/4 bg-white shadow rounded p-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm text-gray-600 hover:text-indigo-600"
        >
          ← Back
        </button>

        <h2 className="text-lg font-semibold mb-4">Account</h2>

        <button
          onClick={() => setActiveTab("details")}
          className={`w-full text-left px-3 py-2 rounded mb-2 ${
            activeTab === "details"
              ? "bg-indigo-600 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          Profile Details
        </button>

        <button
          onClick={() => setActiveTab("password")}
          className={`w-full text-left px-3 py-2 rounded ${
            activeTab === "password"
              ? "bg-indigo-600 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          Update Password
        </button>
      </div>


      <div className="w-3/4 bg-white shadow rounded p-6">
        {activeTab === "details" && <ProfileDetails />}
        {activeTab === "password" && <UpdatePassword />}
      </div>
    </div>
  );
}
