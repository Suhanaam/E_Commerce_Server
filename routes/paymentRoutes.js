import express from "express";
import Stripe from "stripe";
const client_domain = process.env.CLIENT_DOMAIN;
import { authUser } from "../middlewares/authUser.js";
const stripe = new Stripe(process.env.Stripe_Private_Api_Key);

const router = express.Router();

//create checkout session
router.post("/create-checkout-session", authUser, async (req, res, next) => {
    try {
        const { products } = req.body;
        console.log("products.........",products);

        const lineItems = products.map((p) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: p?.product?.name,
                    images: [p?.product?.images?.[0] || "https://via.placeholder.com/150"],
                },
                unit_amount: Math.round(p?.product?.price * 100),
            },
            quantity: 1,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${client_domain}/user/payment/success`,
            cancel_url: `${client_domain}/user/payment/cancel`,
        });

        res.json({ success: true, sessionId: session.id });
    } catch (error) {
        console.error("Stripe error:", error);

        res.status(error.status || 500).json({ error: error.message || "Internal server Error" });
    }
});

// check payment status
router.get("/session-status", async (req, res) => {
    try {
        const sessionId = req.query.session_id;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        res.send({
            data: session,
            status: session?.status,
            customer_email: session?.customer_details?.email,
            session_data: session,
        });
    } catch (error) {
        res.status(error?.statusCode || 500).json(error.message || "internal server error");
    }
});




export { router as paymentRouter };