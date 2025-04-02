import express from "express";
import {
  sellerSignup,
  sellerLogin,
  sellerProfile,
  sellerUpdate,
  sellerLogout,
  getAllSellers,
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
//get all sellers
router.get("/AllSellers",getAllSellers)

export { router as sellerRouter };