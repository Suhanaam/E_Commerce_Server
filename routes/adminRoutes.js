import express from "express";
import { authAdmin } from "../middlewares/authAdmin.js";
import {
    registerAdmin,
    loginAdmin,
    getAllUsers,
    getAllSellers,
    getAllOrders,
    deleteUser,
    deleteSeller,
    getAdminProfile
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/users", authAdmin, getAllUsers);
router.get("/sellers", authAdmin, getAllSellers);
router.get("/orders", authAdmin, getAllOrders);
router.delete("/users/:userId", authAdmin, deleteUser);
router.delete("/sellers/:sellerId", authAdmin, deleteSeller);
router.get("/profile",authAdmin,getAdminProfile);


export { router as adminRouter };
