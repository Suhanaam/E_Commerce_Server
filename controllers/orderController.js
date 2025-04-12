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
      const product = await Product.findById(item.product).populate("seller");
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      const itemPrice = product.price * item.quantity;
      totalAmount += itemPrice;

      updatedItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        seller: product.seller, // 👈 Add seller here
        productDeliveryStatus: "Pending", // 👈 Default status
      });
    }

    const newOrder = new Order({
      sessionId,
      user: req.user.id,
      items: updatedItems,
      totalAmount,
      deliveryAddress,
      paymentStatus: "Paid",
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

//seller order
export const getOrdersForSeller = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const orders = await Order.find({ "items.product": { $exists: true } })
      .populate("items.product", "name images seller")
      .populate("user", "name email");

    const sellerOrders = orders
      .map((order) => {
        const sellerItems = order.items.filter(
          (item) =>
            item.product &&
            item.product.seller &&
            item.product.seller.toString() === sellerId
        );

        if (sellerItems.length === 0) return null;

        return {
          _id: order._id,
          user: order.user,
          deliveryStatus: order.deliveryStatus,
          paymentStatus: order.paymentStatus,
          createdAt: order.createdAt,
          items: sellerItems,
        };
      })
      .filter(Boolean);

    res.status(200).json(sellerOrders);
  } catch (err) {
    console.error("Error fetching seller orders:", err);
    res.status(500).json({ message: "Failed to fetch seller orders" });
  }
};



//update delivery status

export const updateSellerDeliveryStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body; // new status to be set
    const sellerId = req.user.id;

    // Valid statuses for security
    const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid delivery status value" });
    }

    const order = await Order.findById(orderId).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const hasSellerItems = order.items.some(
      (item) => item.product.seller.toString() === sellerId
    );

    if (!hasSellerItems) {
      return res.status(403).json({ message: "You cannot update this order" });
    }

    order.deliveryStatus = status;
    await order.save();

    res.status(200).json({ message: `Delivery status updated to ${status}` });
  } catch (err) {
    console.error("Error updating delivery status:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
};