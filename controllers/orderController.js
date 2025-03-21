import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";

// Create an order
export const createOrder = async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Order must contain at least one item." });
        }

        let totalAmount = 0;
        const updatedItems = [];

        // Fetch product prices from DB
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }

            const itemPrice = product.price * item.quantity;
            totalAmount += itemPrice;

            updatedItems.push({
                product: item.product,
                quantity: item.quantity,
                price: product.price, // Automatically fetching from DB
            });
        }

        // Create new order
        const newOrder = new Order({
            user: req.user.id,
            items: updatedItems,
            totalAmount,
        });

        await newOrder.save();

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get orders by user
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate("items.product");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all orders (Admin)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user items.product");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update order status (Admin)
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        await order.save();

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an order
export const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        await order.deleteOne();
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
