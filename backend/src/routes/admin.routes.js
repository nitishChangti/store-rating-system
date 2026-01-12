import express from "express";
import { authorization } from "../middlewares/verifyJwt.middlewares.js";
import { body } from "express-validator";
const adminRouter = express.Router();
import {AdminCreateUser, getStoreOwners, createStores, adminLogout, getAllStores,  getAdminDashboardStats, getAllUsersForAdmin} from '../controllers/admin.controllers.js'


adminRouter.route("/registerUser").post(
  authorization(["admin"]),
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("address").notEmpty().withMessage("Address is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
   body("role").isIn(["user", "admin", "store_owner"]).withMessage("Invalid role"),
  AdminCreateUser
);

adminRouter.route("/fetch-store-owners").get(
  authorization(['admin']),
  getStoreOwners
);

adminRouter.route('/createstore').post(
  authorization(['admin']),
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("address").notEmpty().withMessage("Address is required"),
  body("owner_id").notEmpty().withMessage("Owner ID is required"),
  createStores
);

adminRouter.route('/logout').get(
  authorization(['admin']),
  adminLogout
)

adminRouter.route("/getallstores").get(
  authorization(['admin']),
  getAllStores);

adminRouter.route("/dashboard-stats").get(
  authorization(['admin']),
  getAdminDashboardStats
);

adminRouter.get(
  "/users",
  authorization(["admin"]),
  getAllUsersForAdmin
);

export {
   adminRouter
}