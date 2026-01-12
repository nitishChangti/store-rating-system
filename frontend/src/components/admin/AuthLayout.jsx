import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export function AuthLayout({ role }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" replace />;

  return user.role === role ? <Outlet /> : <Navigate to="/" replace />;
}
