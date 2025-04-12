import express from "express";
import {
  sellerSignup,
  sellerLogin,
  sellerProfile,
  sellerUpdate,
  sellerLogout,
  getAllSellers,
  acceptProduct,
} from "../controllers/sellerController.js";
import { authSeller } from "../middlewares/authSeller.js";
import { upload } from "../middlewares/multer.js";
import { authAdmin } from "../middlewares/authAdmin.js";
import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";

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

// Seller Route to accept product
router.put("/order/:orderId/product/:productId/accept", acceptProduct);
  
//   async (req, res) => {
//   try {
//     const { orderId, productId } = req.params;

//     // Seller accepts the product
//     await Order.updateOne(
//       { "_id": orderId, "items.product": productId },
//       { $set: { "items.$.product.productDeliveryStatus": "processing" } }
//     );

//     res.status(200).json({ message: "Product accepted by seller." });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// Seller Route to ship product
router.put("/order/:orderId/product/:productId/ship", async (req, res) => {
  try {
    const { orderId, productId } = req.params;

    // Seller ships the product
    await Order.updateOne(
      { "_id": orderId, "items.product": productId },
      { $set: { "items.$.product.productDeliveryStatus": "shipped" } }
    );

    res.status(200).json({ message: "Product shipped by seller." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export { router as sellerRouter };