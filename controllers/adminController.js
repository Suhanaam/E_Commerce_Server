import { Admin } from "../models/adminModel.js";
import { User } from "../models/userModel.js";
import { Seller } from "../models/sellerModel.js";
import { Order } from "../models/orderModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const NODE_ENV=process.env.NODE_ENV


// Admin Registration
export const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await Admin.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({ message: "Admin registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin Login
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });
        res.cookie('token',token,{
            sameSite:NODE_ENV==="production"?"none":"Lax",
            secure:NODE_ENV==="production",
            httpOnly:NODE_ENV==="production",
           });
        console.log(admin.role);
       console.log("log suc");
        res.json({ data:admin,message: "Admin logged in successfully", token });
       
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Sellers
export const getAllSellers = async (req, res) => {
    try {
        const sellers = await Seller.find().select("-password");
        res.json(sellers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user", "name email");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete User (by Admin)
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        await User.findByIdAndDelete(userId);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Seller (by Admin)
export const deleteSeller = async (req, res) => {
    try {
        const { sellerId } = req.params;
        await Seller.findByIdAndDelete(sellerId);
        res.json({ message: "Seller deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getAdminProfile = async (req, res) => {
    try {
        const adminId = req.user.id; // set by auth middleware

        const admin = await Admin.findById(adminId).select("-password"); // exclude password
        if (!admin) {
            return res.status(404).json({ message: "Admin not found." });
        }

        res.status(200).json({ success: true, data: admin });
    } catch (error) {
        console.error("Error fetching admin profile:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Change Admin Password
export const changeAdminPassword = async (req, res) => {
    try {
        const adminId = req.user.id; // set by auth middleware
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Both current and new passwords are required." });
        }

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found." });
        }

        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect." });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedNewPassword;
        await admin.save();

        res.status(200).json({ message: "Password changed successfully." });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
