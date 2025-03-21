import { Cart } from "../models/cartModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";

export const addToCart = async (req, res) => {
    try {
        const { product, quantity, price } = req.body;
        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
        }

        const itemIndex = cart.items.findIndex((item) => item.product.toString() === product);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product, quantity, price });
        }

        await cart.save();
        res.status(200).json({ message: "Item added to cart", cart });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
        res.status(200).json({ cart });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id });
        cart.items = cart.items.filter((item) => item.product.toString() !== req.params.id);
        await cart.save();
        res.status(200).json({ message: "Item removed from cart", cart });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
