import { Router } from "express";
import { submitRating } from "../controllers/rating.controller.js";
import { authorization } from "../middlewares/verifyJwt.middlewares.js";

const ratingRouter = Router();

ratingRouter.post("/ratings", authorization(["user"]), submitRating);

export {
    ratingRouter
} 
    
