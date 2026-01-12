import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { authStart, authSuccess, authFailure } from "../store/authSlice";
import { authService } from "../services/auth";
export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (e) => {
    dispatch(authStart());

    try {
      const response = await authService.login(e.email,e.password)
      console.log('res',response);
      
      dispatch(
        authSuccess({
          user: response.data.data.existingUser,
          token: response.data.data.accessToken,
        })
      );
      if(response.data.data.existingUser.role === 'user'){
        navigate("/");
      }
      else if(response?.data?.data?.existingUser?.role === 'admin'){
        navigate('/admin/dashboard')
      }
      else if(response?.data?.data?.existingUser?.role === 'store_owner'){
        navigate('/store-owner/dashboard')
      }
    } catch (err) {
      dispatch(authFailure(err.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 to-slate-300 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Welcome Back
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Login to continue
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Enter a valid email",
              },
            })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm
                       focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
                       outline-none transition"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm
                       focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
                       outline-none transition"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded-lg bg-indigo-600 px-4 py-2 text-white text-sm font-medium
              transition-all duration-200
              ${
                isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-indigo-700 active:scale-[0.98]"
              }`}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="cursor-pointer font-medium text-indigo-600 hover:underline"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
