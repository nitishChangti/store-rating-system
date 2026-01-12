import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { adminService } from "../../services/admin.js";
export default function CreateStore() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchStoreOwners() {
      try {
        const res = await adminService.fetchStoreOwners();
        console.log("res is for store owner data", res);
        setUsers(res?.data?.data?.storeOwners)
      } catch (error) {
        setMessage(error.message);
      }
    }

    fetchStoreOwners();
  }, []);

  async function onSubmit(formData) {
    console.log(formData);
    setMessage("");

    try {
      const res = await adminService.createStore(formData);
        console.log(res);
      setMessage("Store created successfully");
      reset(); 
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Create Store
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Store Name"
            className="w-full rounded-md border px-3 py-2"
            {...register("name", {
              required: "Store name is required",
              minLength: {
                value: 3,
                message: "Minimum 3 characters",
              },
            })}
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            placeholder="Store Email"
            className="w-full rounded-md border px-3 py-2"
            {...register("email", {
              required: "Email is required",
            })}
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <textarea
            placeholder="Store Address"
            className="w-full rounded-md border px-3 py-2"
            {...register("address", {
              required: "Address is required",
            })}
          />
          {errors.address && (
            <p className="text-sm text-red-600 mt-1">
              {errors.address.message}
            </p>
          )}
        </div>

        <div>
          <select
            className="w-full rounded-md border px-3 py-2"
            {...register("owner_id", {
              required: "Please select a store owner",
            })}
          >
            <option value="">Select Store Owner</option>

            {users.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name}
              </option>
            ))}
          </select>
          {errors.owner_id && (
            <p className="text-sm text-red-600 mt-1">
              {errors.owner_id.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create Store"}
        </button>

        {message && <p className="text-sm text-gray-700 mt-2">{message}</p>}
      </form>
    </div>
  );
}
