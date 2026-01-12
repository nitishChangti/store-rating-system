import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { validationResult } from "express-validator";
import { findUserByEmail, updatePassword } from "../models/user.models.js";
import { fetchSingleStores, fetchStores } from "../models/store.models.js";
import { generateAccessAndRefreshTokens } from "../utils/token.utils.js";
import { hashPassword, comparePassword } from "../utils/password.utils.js";
import { createUserWithAuth } from "../utils/createUser.utils.js";
const RegisterUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(400, errors.array()[0].msg);
  }
  const { name, email, address, password } = req.body;

  const user = await createUserWithAuth({
    name,
    email,
    address,
    password,
    role: "user",
  });

  if (!user) {
    throw new ApiError(
      500,
      "Registration Failed. Please try again localStorage."
    );
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user
  );

  //  PRODUCTION (HTTPS)
  // const cookieOptions = {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: "none",
  // };

  const cookiesOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookiesOptions)
    .json(
      new ApiResponse(
        201,
        { user, accessToken },
        "User Registered Successfully",
        true
      )
    );
});

const LoginUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, errors.array[0].msg);
  }

  const { email, password } = req.body;

  const existingUser = await findUserByEmail(email);
  if (!existingUser) {
    throw new ApiError(404, "User does not exist. Please register.");
  }

  const result = await comparePassword(password, existingUser.password);

  if (!result) {
    throw new ApiError(401, "Invalid email or password");
  }
  delete existingUser.password;
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    existingUser
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { existingUser, accessToken },
        "User Logged Successfully",
        true
      )
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user },
        "getCurrentUser data got Successfully",
        true
      )
    );
});

const updateUserPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body.currentPassword;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "All fields are required");
  }

  const user = req.user;
  console.log(currentPassword, user.password);
  const getExistingUser = await findUserByEmail(user.email);
  const isMatch = await comparePassword(
    currentPassword,
    getExistingUser.password
  );
  if (!isMatch) {
    throw new ApiError(401, "Current password is incorrect");
  }

  const hashedNewPassword = await hashPassword(newPassword);

  await updatePassword(user.id, hashedNewPassword);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password updated successfully", true));
});

const getUserProfile = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        profile: req.user,
      },
      "User Profile Got Successfully",
      true
    )
  );
});

const userLogout = asyncHandler(async (req, res) => {
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
});

const getAllStores = asyncHandler(async (req, res) => {
  const stores = await fetchStores();
  if (!stores) {
    throw new ApiError(500, "Stores are not available");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, stores, "Stores fetched successfully", true));
});

const getStoreById = asyncHandler(async (req, res) => {
  const storeId = Number(req.params.id);

  if (!storeId) {
    throw new ApiError(400, "Invalid store id");
  }
  const userId = req.user.id;

  const result = await fetchSingleStores(storeId, userId);

  if (!result) {
    throw new ApiError(404, "Store not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Store fetched", true));
});
export {
  RegisterUser,
  LoginUser,
  getCurrentUser,
  updateUserPassword,
  getUserProfile,
  userLogout,
  getAllStores,
  getStoreById,
};
