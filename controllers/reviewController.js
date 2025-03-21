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

export const deleteReview = async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.reviewId);
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
