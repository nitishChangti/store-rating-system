import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import {
  getStoreByOwnerId,
  getRatingsForStore
} from "../models/storeOwner.models.js";

export const getStoreOwnerDashboard = asyncHandler(async (req, res) => {
   const ownerId = req.user.id;

   const store = await getStoreByOwnerId(ownerId);

  if (!store) {
    throw new ApiError(404, "Store not found for this owner");
  }

  const ratings = await getRatingsForStore(store.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        store: {
          id: store.id,
          name: store.name,
          address: store.address,
          averageRating: Number(store.rating || 0),
        },
        ratings,
      },
      "Store owner dashboard data fetched successfully",
      true
    )
  );
});
