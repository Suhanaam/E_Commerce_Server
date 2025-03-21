import express from "express";
import { authUser } from "../middlewares/authUser.js";
import { authAdmin } from "../middlewares/authAdmin.js";

import { 
    createOrder, 
    getUserOrders, 
    getAllOrders, 
    updateOrderStatus, 
    deleteOrder 
} from "../controllers/orderController.js";

const router = express.Router();

// Create order (User)
router.post("/create", authUser, createOrder);

// Get user orders
router.get("/user", authUser, getUserOrders);

// Get all orders (Admin)
router.get("/", authAdmin, getAllOrders);

// Update order status (Admin)
router.put("/:orderId", authAdmin, updateOrderStatus);

// Delete an order (Admin)
router.delete("/:orderId", authAdmin, deleteOrder);


export { router as orderRouter };
