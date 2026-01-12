import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { authService } from "../services/auth.js";
export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = async() => {
    const response = await authService.UserLogOut();
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 flex justify-between items-center">
        <h1
          className="text-xl font-semibold text-indigo-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          Store Ratings
        </h1>

        <div className="space-x-4">
          {!isAuthenticated && (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-sm font-medium text-gray-600 hover:text-indigo-600"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
              >
                Register
              </button>
            </>
          )}

          {isAuthenticated && (
            <>
              <button
                onClick={() => navigate("/profile")}
                className="text-sm font-medium text-gray-600 hover:text-indigo-600"
              >
                {user?.name || "Profile"}
              </button>

              <button
                onClick={handleLogout}
                className="rounded-md bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
