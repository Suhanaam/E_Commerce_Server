import { Wishlist } from "../models/wishlistModel.js";

export const addToWishlist = async (req, res) => {
    try {
        const { product } = req.body;
        let wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            wishlist = new Wishlist({ user: req.user.id, products: [] });
        }

        if (!wishlist.products.includes(product)) {
            wishlist.products.push(product);
        }

        await wishlist.save();
        res.status(200).json({ message: "Product added to wishlist", wishlist });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user.id }).populate("products");
        res.status(200).json({ wishlist });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const removeFromWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user.id });
        wishlist.products = wishlist.products.filter((prod) => prod.toString() !== req.params.id);
        await wishlist.save();
        res.status(200).json({ message: "Product removed from wishlist", wishlist });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
