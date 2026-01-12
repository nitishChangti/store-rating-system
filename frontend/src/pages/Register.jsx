import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { authService } from "../services/auth.js";
import { authStart, authSuccess, authFailure } from "../store/authSlice";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [localError, setLocalError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    dispatch(authStart());
    setLocalError(null);

    try {
      const res = await authService.register(formData);

      dispatch(
        authSuccess({
          user: res.data.user,
          token: res.data.accessToken,
        })
      );

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      dispatch(authFailure(err.message));
      setLocalError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Create Account
        </h2>

        <p className="text-sm text-center text-gray-500 mb-6">
          Register to rate stores
        </p>

        {localError && (
          <div className="mb-4 rounded-md bg-red-100 px-4 py-2 text-sm text-red-700">
            {localError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 20,
                message: "Name must be at least 20 characters",
              },
              maxLength: {
                value: 60,
                message: "Name must not exceed 60 characters",
              },
            })}
            className="w-full rounded-lg border px-4 py-2 text-sm"
          />
          {errors.name && (
            <p className="text-xs text-red-600">{errors.name.message}</p>
          )}

          <input
            type="email"
            placeholder="Email Address"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format",
              },
            })}
            className="w-full rounded-lg border px-4 py-2 text-sm"
          />
          {errors.email && (
            <p className="text-xs text-red-600">{errors.email.message}</p>
          )}

          <input
            type="text"
            placeholder="Address"
            {...register("address", {
              required: "Address is required",
              maxLength: {
                value: 400,
                message: "Address must not exceed 400 characters",
              },
            })}
            className="w-full rounded-lg border px-4 py-2 text-sm"
          />
          {errors.address && (
            <p className="text-xs text-red-600">{errors.address.message}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              maxLength: {
                value: 16,
                message: "Password must not exceed 16 characters",
              },
              pattern: {
                value: /^(?=.*[A-Z])(?=.*[!@#$%^&*])/,
                message:
                  "Password must contain one uppercase and one special character",
              },
            })}
            className="w-full rounded-lg border px-4 py-2 text-sm"
          />
          {errors.password && (
            <p className="text-xs text-red-600">{errors.password.message}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white text-sm hover:bg-indigo-700"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="cursor-pointer font-medium text-indigo-600 hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
