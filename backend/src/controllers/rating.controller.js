import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import {avgStoreRating, updateStoreRatings} from '../models/rating.models.js'
export const submitRating = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { storeId, rating } = req.body;
  if (!storeId || !rating) {
    throw new ApiError(400, "Store ID and rating are required");
  }

  if (rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  await updateStoreRatings(userId, storeId, rating);

    const avgRating = await avgStoreRating(storeId);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        rating,
        overallRating: avgRating
      },
      "Rating submitted successfully",
      true
    )
  );
});