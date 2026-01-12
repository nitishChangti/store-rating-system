import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App.jsx";

import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Profile from "../pages/Profile.jsx";
import Home from "../pages/Home.jsx";
import {
  ProtectedRoute,
  AuthLayout,
  StoreDetails,
} from "../components/index.js";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import StoreOwnerDashboard from "../pages/storeOwner/StoreOwnerDashboard.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "store/:storeId",
            element: <StoreDetails />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            element: <AuthLayout role="admin" />,
            children: [
              {
                path: "admin/dashboard",
                element: <AdminDashboard />,
              },
            ],
          },
          {
            element: <AuthLayout role="store_owner" />,
            children: [
              {
                path: "store-owner/dashboard",
                element: <StoreOwnerDashboard />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
