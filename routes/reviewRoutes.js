import express from "express";
import { addReview, getReviews, deleteReview, getReviewsByUser, updateReview, getSellerProductReviews } from "../controllers/reviewController.js";
import { authUser } from "../middlewares/authUser.js";
import { authSeller } from "../middlewares/authSeller.js";

const router = express.Router();

router.post("/add", authUser, addReview);
router.get("/:productId", getReviews);

router.get("/my-reviews", authUser, getReviewsByUser);
router.put("/update/:reviewId", authUser, updateReview);
router.delete("/delete/:reviewId", authUser, deleteReview);
router.get("/seller-reviews", authSeller, getSellerProductReviews);


export { router as reviewRouter };