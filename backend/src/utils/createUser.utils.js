import { findUserByEmail, createUser } from "../models/user.models.js";
import { hashPassword } from "./password.utils.js";
import {ApiError} from "./ApiError.utils.js";

export const createUserWithAuth = async ({
  name,
  email,
  address,
  password,
  role = "USER",
}) => {
  // Check existing user
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await createUser({
    name,
    email,
    address,
    password: hashedPassword,
    role,
  });

  if (!user) {
    throw new ApiError(500, "User creation failed");
  }

  return user;
};
