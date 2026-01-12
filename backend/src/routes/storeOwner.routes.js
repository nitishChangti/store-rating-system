import express from "express";
const storeOwnerRouter = express.Router();
import { getStoreOwnerDashboard } from "../controllers/storeOwner.controller.js";
import { authorization } from "../middlewares/verifyJwt.middlewares.js";

storeOwnerRouter.get(
  "/dashboard/store-details",
  authorization(["store_owner"]),
  getStoreOwnerDashboard
);

export {storeOwnerRouter};
