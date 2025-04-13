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
import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";


const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/users", authAdmin, getAllUsers);
router.get("/sellers", authAdmin, getAllSellers);
router.get("/orders", authAdmin, getAllOrders);
router.delete("/users/:userId", authAdmin, deleteUser);
router.delete("/sellers/:sellerId", authAdmin, deleteSeller);
router.get("/profile",authAdmin,getAdminProfile);

// Admin Route to handle accepting a seller's product
router.put("/order/:orderId/product/:productId/accept", async (req, res) => {
  try {
    const { orderId, productId } = req.params;

    // Update product's productDeliveryStatus to "processing" if it is not already "processing"
    const result = await Order.updateOne(
      { "_id": orderId, "items.product": productId, "items.productDeliveryStatus": { $ne: "processing" } },
      { $set: { "items.$.productDeliveryStatus": "processing" } }
    );

    if (result.nModified === 0) {
      return res.status(400).json({ message: "Product is already in processing or not found." });
    }

    res.status(200).json({ message: "Product accepted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Route to check if all products are processing before setting order to processing
router.get("/order/:orderId/check-processing", async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    const allProcessed = order.items.every(
      (item) => item.productDeliveryStatus === "processing"
    );

    res.status(200).json({ allProcessed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Route to set order status to processing
// router.put("/order/:orderId/set-processing", async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     // Ensure all products are in "processing" before setting the order to "processing"
//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ message: "Order not found." });
//     }

//     const allProcessed = order.items.every(
//       (item) => item.productDeliveryStatus === "processing"
//     );

//     if (!allProcessed) {
//       return res.status(400).json({ message: "Not all products are in processing." });
//     }

//     // Update order deliveryStatus to "processing"
//     await Order.updateOne({ _id: orderId }, { $set: { deliveryStatus: "processing" } });

//     res.status(200).json({ message: "Order set to processing." });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });



// Admin Route to set order status to shipped
router.put("/order/:orderId/set-shipped", async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "Order not found." });

  if (order.deliveryStatus === "shipped") {
    return res.status(400).json({ message: "Order is already shipped." });
  }

  await Order.updateOne(
    { _id: orderId },
    {
      $set: {
        deliveryStatus: "shipped",
        "items.$[].productDeliveryStatus": "Shipped",
      },
    }
  );

  res.status(200).json({ message: "Order marked as shipped." });
});


// Update deliveryStatus of order manually from frontend logic
router.put("/order/:orderId/set-delivery-status", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found." });

    order.deliveryStatus = status;
    await order.save();

    res.status(200).json({ message: "Order delivery status updated." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//mark delivered order

router.put("/order/:orderId/set-delivered", async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found." });

    if (order.deliveryStatus === "Delivered") {
      return res.status(400).json({ message: "Order is already delivered." });
    }

    await Order.updateOne(
      { _id: orderId },
      {
        $set: {
          deliveryStatus: "Delivered",
          "items.$[].productDeliveryStatus": "Delivered",
        },
      }
    );

    res.status(200).json({ message: "Order marked as delivered." });
  } catch (error) {
    res.status(500).json({ message: "Error marking order as delivered." });
  }
});

//cancel order

router.put("/order/:orderId/cancel", async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found." });

    if (order.deliveryStatus === "Cancelled") {
      return res.status(400).json({ message: "Order is already cancelled." });
    }

    await Order.updateOne(
      { _id: orderId },
      {
        $set: {
          deliveryStatus: "Cancelled",
          "items.$[].productDeliveryStatus": "Cancelled",
        },
      }
    );

    res.status(200).json({ message: "Order cancelled successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling order." });
  }
});




export { router as adminRouter };
