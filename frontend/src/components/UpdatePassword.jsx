import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  updatePasswordStart,
  updatePasswordSuccess,
  updatePasswordFailure,
  resetPasswordState,
  setMessage
} from "../store/authSlice";
import { authService } from "../services/auth";
import { useEffect, useState } from "react";

export default function UpdatePassword() {
  const dispatch = useDispatch();
  const { loading, error, passwordUpdated } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const newPassword = watch("newPassword");

  const onSubmit = async (data) => {
    try {
      dispatch(updatePasswordStart());

      await authService.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      console.log('onsuccess');

      dispatch(updatePasswordSuccess());
      dispatch(setMessage("Password updated successfully"));
      reset();
      
    } catch (err) {
      dispatch(
        updatePasswordFailure(
          err.response?.data?.message || "Password update failed"
        )
      );
    }
  };

  useEffect(() => {
    if (passwordUpdated) {
      reset();
      dispatch(resetPasswordState());
    }
  }, [passwordUpdated, dispatch, reset]);

  return (
    <div>
   
      <h2 className="text-xl font-semibold mb-4">
        Update Password
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-md"
      >
        <input
          type="password"
          placeholder="Current Password"
          className="w-full border px-3 py-2 rounded"
          {...register("currentPassword", {
            required: "Current password is required",
          })}
        />
        {errors.currentPassword && (
          <p className="text-red-500 text-sm">
            {errors.currentPassword.message}
          </p>
        )}

        <input
          type="password"
          placeholder="New Password"
          className="w-full border px-3 py-2 rounded"
          {...register("newPassword", {
            required: "New password is required",
            minLength: {
              value: 6,
              message: "Minimum 6 characters",
            },
          })}
        />
        {errors.newPassword && (
          <p className="text-red-500 text-sm">
            {errors.newPassword.message}
          </p>
        )}

        <input
          type="password"
          placeholder="Confirm New Password"
          className="w-full border px-3 py-2 rounded"
          {...register("confirmPassword", {
            validate: (value) =>
              value === newPassword || "Passwords do not match",
          })}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}

      

        {passwordUpdated && (
          <p className="text-green-600 text-sm">
            Password updated successfully
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
