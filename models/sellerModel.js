import mongoose, { Schema } from "mongoose";

const sellerSchema = new Schema(
  {
    name: { type: String, required: true, maxLength: 50 },
    email: { type: String, required: true, unique: true, maxLength: 30 },
    password: { type: String, required: true, minLength: 6 },
    mobile: { type: String, required: true },
    profilePic: {
      type: String,
      default: "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg",
    },
    role: { type: String, default: "seller" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
export const Seller = mongoose.model("Seller", sellerSchema);