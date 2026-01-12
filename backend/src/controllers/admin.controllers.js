import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { createUserWithAuth } from "../utils/createUser.utils.js";
import { validationResult } from "express-validator";
import {
  fetchStoreOwners,
  createStore,
  storeEmailExists,
  storeOwnerExists,
  fetchStores 
} from "../models/store.models.js";

import { fetchAdminDashboardStats,  fetchAllUsersForAdmin} from "../models/admin.model.js";


const AdminCreateUser = asyncHandler(async (req, res) => {
   const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(400, errors.array()[0].msg);
  }

  const { name, email, address, password, role } = req.body;

   const user = await createUserWithAuth({
    name,
    email,
    address,
    password,
    role, 
  });
  console.log("user", user);
  if (!user) {
    throw new ApiError(
      500,
      "Registration Failed. Please try again localStorage."
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { user }, "User created by admin", true));
});

const getStoreOwners = asyncHandler(async (req, res) => {
    const storeOwners = await fetchStoreOwners();
  if (!storeOwners) {
    throw new ApiError(500, "failed to get store owners");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { storeOwners },
        "Successfully got store owners data",
        true
      )
    );
});

const createStores = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(400, errors.array()[0].msg);
  }
  const {name, email, address, owner_id} = req.body;
  if (await storeEmailExists(email)) {
    throw new ApiError(409, "Store email already exists");
  }

  if (!(await storeOwnerExists(owner_id))) {
    throw new ApiError(404, "Store owner not found");
  }

  const store = await createStore({
    name,
    email,
    address,
    owner_id,
  });

  if(!store){
    throw new ApiError(500, 'Failed to create a store ')
  }
  return res
    .status(201)
    .json(new ApiResponse(201, store, "Store created successfully"));
});

const adminLogout = asyncHandler( async( req, res)=>{
       const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax", 
    path: "/",
  };

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully", true));
})

const getAllStores = asyncHandler(async (req, res) => {
  const stores = await fetchStores();
    if(!stores){
        throw new ApiError(500, 'Stores are not available')
    }
  return res.status(200).json(
    new ApiResponse(200, stores, "Stores fetched successfully",true)
  );
});


export const getAdminDashboardStats = asyncHandler(async (req, res) => {
  const stats = await fetchAdminDashboardStats();

  return res.status(200).json(
    new ApiResponse(
      200,
      stats,
      "Admin dashboard stats fetched successfully",
      true
    )
  );
});

const getAllUsersForAdmin = asyncHandler(async (req, res) => {
  const users = await fetchAllUsersForAdmin();

  return res.status(200).json(
    new ApiResponse(
      200,
      users,
      "Users fetched successfully",
      true
    )
  );
});

export { AdminCreateUser, getStoreOwners, createStores, adminLogout, getAllStores, getAllUsersForAdmin};
