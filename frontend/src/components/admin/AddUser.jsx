import { useForm } from "react-hook-form";
import { adminService } from "../../services/admin.js";
import { useState } from "react";

export default function AddUser() {
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      role: "USER",
    },
  });

  const onSubmit = async (data) => {
    setServerError(null);
    setSuccess(null);

    try {
      await adminService.registerUsers(data);
      setSuccess("User created successfully");
      reset();
    } catch (error) {
      setServerError(
        error?.response?.data?.message || "Failed to create user"
      );
    }
  };

  return (
    <div className="max-w-xl rounded-xl bg-white p-8 shadow-md">
      <h1 className="mb-6 text-2xl font-semibold text-gray-800">
        Add New User
      </h1>

      {serverError && (
        <p className="mb-4 text-sm text-red-600">{serverError}</p>
      )}

      {success && (
        <p className="mb-4 text-sm text-green-600">{success}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            {...register("name", { required: "Name is required" })}
            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-200"
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>


        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email",
              },
            })}
            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-200"
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            {...register("password", {
              required: "Password required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters",
              },
            })}
            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-200"
          />
          {errors.password && (
            <p className="text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            {...register("address")}
            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            {...register("role")}
            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-200"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>

        <button
          disabled={isSubmitting}
          className={`w-full rounded-lg py-2 text-white font-medium ${
            isSubmitting
              ? "bg-indigo-400"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isSubmitting ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
}
