import { Review } from "../models/reviewModel.js";
import { Product } from "../models/productModel.js";
import { Seller } from "../models/sellerModel.js";
import { Admin } from "../models/adminModel.js";
import { User } from "../models/userModel.js";
import { Order } from "../models/orderModel.js";


export const addReview = async (req, res) => {
  try {
    const { product, rating, comment } = req.body;
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. User not found in request." });
    }

    const review = new Review({
      user: req.user.id,
      product,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    console.error("Error creating review:", error); // ✅ log actual error
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId }).populate("user", "name");
        console.log("hi");
        res.status(200).json({ reviews });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};


// user view reviews
export const getReviewsByUser = async (req, res) => {
  try {
    console.log("Fetching reviews for user:", req.user);
    const userId = req.user._id; // assuming user is authenticated
    console.log("Fetching reviews for user id:", req.user._id);
     
    const reviews = await Review.find({ user: userId }).populate("product");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews", error });
  }
};
// Update a review
export const updateReview = async (req, res) => {
    try {
      const { reviewId } = req.params;
      const { rating, comment } = req.body;
  
      const review = await Review.findOneAndUpdate(
        { _id: reviewId, user: req.user._id },
        { rating, comment },
        { new: true }
      );
  
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
  
      res.status(200).json(review);
    } catch (error) {
      res.status(500).json({ message: "Failed to update review", error });
    }
  };
  
  // Delete a review
  export const deleteReview = async (req, res) => {
    try {
      const { reviewId } = req.params;
  
      const deleted = await Review.findOneAndDelete({
        _id: reviewId,
        user: req.user._id,
      });
  
      if (!deleted) {
        return res.status(404).json({ message: "Review not found" });
      }
  
      res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete review", error });
    }
  };
  
  //seller reviews
  export const getSellerProductReviews = async (req, res) => {
    try {
      const sellerId = req.user._id;
      console.log("Fetching reviews for user id:", req.user._id);

      console.log("Fetching reviews for user id:", sellerId);
    
      // Find all products of the seller
      const sellerProducts = await Product.find({ seller: sellerId }).select("_id");
  
      const productIds = sellerProducts.map((product) => product._id);
  
      // Find reviews for these products
      const reviews = await Review.find({ product: { $in: productIds } })
        .populate("user", "name email")
        .populate("product", "name");
  
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch seller reviews", error });
    }
  };
  
  // admin view all reviews



// Get all reviews (Admin only)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("product", "name");
    console.log("hi helo");
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

