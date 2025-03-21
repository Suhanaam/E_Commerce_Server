import express from "express";
import { addToCart, getCart, removeFromCart } from "../controllers/cartController.js";
import { authUser } from "../middlewares/authUser.js";

const router = express.Router();

router.post("/add", authUser, addToCart);
router.get("/", authUser, getCart);
router.delete("/remove/:id", authUser, removeFromCart);

export { router as cartRouter };