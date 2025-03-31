import express from "express";
import {
  sellerSignup,
  sellerLogin,
  sellerProfile,
  sellerUpdate,
  sellerLogout,
} from "../controllers/sellerController.js";
import { authSeller } from "../middlewares/authSeller.js";
import { upload } from "../middlewares/multer.js";
import { authAdmin } from "../middlewares/authAdmin.js";

const router = express.Router();
//signup
router.post("/signup",authAdmin,upload.single("Sellerimage"), sellerSignup);
//login
router.post("/login", sellerLogin);
//fetch profile
router.get("/profile", authSeller, sellerProfile);
//update
router.put("/update", authSeller, sellerUpdate);
//logut
router.get("/logout", sellerLogout);

export { router as sellerRouter };