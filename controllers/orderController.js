import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";

// Create an order
export const createOrder = async (req, res) => {
  try {
    const { sessionId, items, deliveryAddress } = req.body;

    if (!sessionId || !items || items.length === 0 || !deliveryAddress) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    let totalAmount = 0;
    const updatedItems = [];

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
        price: product.price,
      });
    }

    const newOrder = new Order({
      sessionId,
      user: req.user.id,
      items: updatedItems,
      totalAmount,
      deliveryAddress,
      paymentStatus: "Paid", // Assuming payment is done
      deliveryStatus: "Pending",
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

// Update delivery status (Admin/Seller)
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryStatus } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.deliveryStatus = deliveryStatus;
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
