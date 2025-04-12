import express from "express";
import { authUser } from "../middlewares/authUser.js";
import { authAdmin } from "../middlewares/authAdmin.js";
import {authSeller} from "../middlewares/authSeller.js";

import { 
    createOrder, 
    getUserOrders, 
    getAllOrders, 
    updateDeliveryStatus, 
    deleteOrder, 
    getOrdersForSeller,
    updateSellerDeliveryStatus
} from "../controllers/orderController.js";

const router = express.Router();

// Create order (User)
router.post("/create", authUser, createOrder);

// Get user orders (User)
router.get("/user", authUser, getUserOrders);

// Get all orders (Admin)
router.get("/", authAdmin, getAllOrders);

// Update delivery status (Admin)
router.put("/:orderId", authAdmin, updateDeliveryStatus);

// Delete an order (Admin)
router.delete("/:orderId", authAdmin, deleteOrder);

// get seller orders

router.get("/seller-orders",authSeller,getOrdersForSeller);

// update delivery status

router.put("/update-delivery-status/:orderId",authSeller,updateSellerDeliveryStatus);

export { router as orderRouter };
