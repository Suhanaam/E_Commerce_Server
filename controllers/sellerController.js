import { Seller } from "../models/sellerModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";

export const sellerSignup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, mobile, profilePic } = req.body;

    if (!name || !email || !password || !confirmPassword || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const sellerExists = await Seller.findOne({ email });
    if (sellerExists) {
      return res.status(400).json({ message: "Seller already exists" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newSeller = new Seller({ name, email, password: hashedPassword, mobile, profilePic });
    await newSeller.save();

    const token = generateToken(newSeller.id, "seller");
    res.cookie("token", token);
    res.json({ data: newSeller, message: "Seller registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const passwordMatch = bcrypt.compareSync(password, seller.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!seller.isActive) {
      return res.status(403).json({ message: "Seller account is not active" });
    }

    const token = generateToken(seller._id, "seller");
    res.cookie("token", token);
    delete seller._doc.password;
    res.json({ data: seller, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const sellerProfile = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const seller = await Seller.findById(sellerId).select("-password");
    res.json({ data: seller, message: "Seller profile fetched" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const sellerUpdate = async (req, res) => {
  try {
    const { name, email, mobile, profilePic } = req.body;
    const sellerId = req.user.id;

    const updatedSeller = await Seller.findByIdAndUpdate(
      sellerId,
      { name, email, mobile, profilePic },
      { new: true }
    );

    res.json({ data: updatedSeller, message: "Seller profile updated" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const sellerLogout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Seller logged out successfully" });
};
