import { Product } from "../models/productModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";

export const createProduct = async (req, res) => {
    try {
        const { name, brand, description, price, stock, category, images } = req.body;
       
        if (!name || !brand || !description || !price || !stock || !category) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newProduct = new Product({
            name,
            brand,
            description,
            price,
            stock,
            category,
            images: images && images.length > 0 ? images : undefined,
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
