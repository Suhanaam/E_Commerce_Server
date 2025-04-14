import { Review } from "../models/reviewModel.js";

export const addReview = async (req, res) => {
    try {
        const { product, rating, comment } = req.body;
        const review = new Review({ user: req.user.id, product, rating, comment });
        await review.save();
        res.status(201).json({ message: "Review added successfully", review });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId }).populate("user", "name");
        res.status(200).json({ reviews });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};



export const getReviewsByUser = async (req, res) => {
  try {
    const userId = req.user._id; // assuming user is authenticated
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
  
  export const getSellerProductReviews = async (req, res) => {
    try {
      const sellerId = req.user._id;
  
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
  