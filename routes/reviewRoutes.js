import express from "express";
import { addReview, getReviews, deleteReview } from "../controllers/reviewController.js";
import { authUser } from "../middlewares/authUser.js";

const router = express.Router();

router.post("/add", authUser, addReview);
router.get("/:productId", getReviews);
router.delete("/delete/:reviewId", authUser, deleteReview);

export { router as reviewRouter };