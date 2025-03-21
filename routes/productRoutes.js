import express from "express";
import { createProduct, updateProduct, deleteProduct, getSellerProducts, getAllProducts } from "../controllers/productController.js";
import { authSeller } from "../middlewares/authSeller.js";

const router = express.Router();

// Create Product
router.post("/create", authSeller, createProduct);

// Update Product
router.put("/update/:id", authSeller, updateProduct);

// Delete Product
router.delete("/delete/:id", authSeller, deleteProduct);

// Get Seller Products
router.get("/seller", authSeller, getSellerProducts);

// Get All Products
router.get("/all", getAllProducts);

export { router as productRouter };