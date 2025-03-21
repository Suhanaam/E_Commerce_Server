import express from "express";
import {
  sellerSignup,
  sellerLogin,
  sellerProfile,
  sellerUpdate,
  sellerLogout,
} from "../controllers/sellerController.js";
import { authSeller } from "../middlewares/authSeller.js";

const router = express.Router();

router.post("/signup", sellerSignup);
router.post("/login", sellerLogin);
router.get("/profile", authSeller, sellerProfile);
router.put("/update", authSeller, sellerUpdate);
router.get("/logout", sellerLogout);

export { router as sellerRouter };