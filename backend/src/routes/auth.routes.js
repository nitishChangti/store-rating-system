import express from "express";
const authRouter = express.Router();
import { body } from "express-validator";
import {
  RegisterUser,
  LoginUser,
  getCurrentUser,
  updateUserPassword,
  getUserProfile,
  userLogout,
  getStoreById,
  getAllStores,
} from "../controllers/auth.controllers.js";
import {
  veriftJWT,
  authorization,
} from "../middlewares/verifyJwt.middlewares.js";


authRouter.route("/register").post(
  body("name")
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage("Name must be between 20 and 60 characters"),

  body("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Invalid email address"),

  body("address")
    .trim()
    .isLength({ max: 400 })
    .withMessage("Address must not exceed 400 characters"),

  body("password")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be 8-16 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[!@#$%^&*]/)
    .withMessage("Password must contain at least one special character"),

  RegisterUser
);


authRouter
  .route("/login")
  .post(
    body("email")
      .isEmail()
      .withMessage("Email must be in format like 123@gmail.com"),
    body("password")
      .isString()
      .notEmpty()
      .withMessage("Password must be a string"),
    LoginUser
  );

authRouter.route("/getcurrentuser").get(veriftJWT, getCurrentUser);

authRouter
  .route("/update-password")
  .post(
    authorization(["user"]),
    body("oldPassword")
      .isString()
      .notEmpty()
      .withMessage("Old password must be a string"),
    body("newPassword")
      .isString()
      .isLength({ min: 6, max: 10 })
      .withMessage("New password must be a string between 6 and 10 characters"),
    updateUserPassword
  );

authRouter.route("/profile").get(authorization(["user"]), getUserProfile);

authRouter.route("/logout").get(authorization(["user"]), userLogout);

authRouter.route("/stores/:id").get(authorization(["user"]), getStoreById);

authRouter.route("/getallstores").get(getAllStores);

export { authRouter };
