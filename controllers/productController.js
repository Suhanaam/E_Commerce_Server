import { Product } from "../models/productModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";
import { cloudinaryInstance } from "../config/cloudinary.js";

export const createProduct = async (req, res) => {
    try {
        const { name, brand, description, price, stock, category } = req.body;
       
        if (!name || !brand || !description || !price || !stock || !category) {
            return res.status(400).json({ message: "All fields are required." });
        }
      // console.log(req.file,'=======req.file');
       
       //cloudinary
      const cloudinaryRes=await cloudinaryInstance.uploader.upload(req.file.path)
     console.log("cloudinary response====",cloudinaryRes);


        const newProduct = new Product({
            name,
            brand,
            description,
            price,
            stock,
            category,
            images: cloudinaryRes.secure_url,
            seller: req.user.id,
        });
       
        await newProduct.save();
        res.json({ data: newProduct, message: "Product created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ data: updatedProduct, message: "Product updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getSellerProducts = async (req, res) => {
    try {
        const products = await Product.find({ seller: req.user.id });
        res.json({ data: products, message: "Seller products fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ data: products, message: "All products fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ data: product });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
