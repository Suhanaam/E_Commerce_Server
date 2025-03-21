import express from "express";
import { addToWishlist, getWishlist, removeFromWishlist } from "../controllers/wishlistController.js";
import { authUser } from "../middlewares/authUser.js";

const router = express.Router();

router.post("/add", authUser, addToWishlist);
router.get("/", authUser, getWishlist);
router.delete("/remove/:id", authUser, removeFromWishlist);

export { router as wishlistRouter };