import { useEffect } from "react";
import { useSelector } from "react-redux";
import { authService } from "../services/auth.js";
export default function ProfileDetails() {
  const { user, loading } = useSelector((state) => state.auth);
  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (!user) {
    return <p>No profile data</p>;
  }
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Profile Details</h2>

      <div className="space-y-3">
        <p>
          <span className="font-medium">Name:</span> {user?.name}
        </p>

        <p>
          <span className="font-medium">Email:</span> {user?.email}
        </p>

        <p>
          <span className="font-medium">Address:</span> {user?.address}
        </p>

        <p>
          <span className="font-medium">Role:</span> {user?.role}
        </p>
      </div>
    </div>
  );
}
