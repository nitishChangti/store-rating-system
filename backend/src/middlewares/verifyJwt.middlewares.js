import { ApiError } from "../utils/ApiError.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import Jwt from "jsonwebtoken";
import config from "../config/config.js";
import { findUserById } from "../models/user.models.js";
const veriftJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    console.log("token", token);
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    const decodedToken = Jwt.verify(token, config.get("ACCESS_TOKEN_SECRET"));
    console.log("decodetoken", decodedToken, decodedToken.id);
    const user = await findUserById(decodedToken.id);
    console.log(user);
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    delete user.password;
    console.log(user);
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});

const authorization = (allowedRoles = []) =>
  asyncHandler(async (req, res, next) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = Jwt.verify(
      token,
      config.get("ACCESS_TOKEN_SECRET")
    );

    // ✅ Role check
    if (!allowedRoles.includes(decodedToken.role)) {
      throw new ApiError(403, "Access denied");
    }

    const user = await findUserById(decodedToken.id);
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    delete user.password;
    req.user = user;

    next();
  });

export {veriftJWT,authorization };
