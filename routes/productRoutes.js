import express from "express";
import { createProduct, updateProduct, deleteProduct, getSellerProducts, getAllProducts, getProductById } from "../controllers/productController.js";
import { authSeller } from "../middlewares/authSeller.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

// Create Product
router.post("/create", authSeller,upload.single("image"), createProduct);

// Update Product
router.put("/update/:id", authSeller, updateProduct);

// Delete Product
router.delete("/delete/:id", authSeller, deleteProduct);

// Get Seller Products
router.get("/seller", authSeller, getSellerProducts);

// Get All Products
router.get("/all", getAllProducts);

//get product by id

router.get("/:id",getProductById);

export { router as productRouter };