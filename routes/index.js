import express from "express";

import {userRouter} from'./userRoutes.js'
import {sellerRouter} from './sellerRoutes.js'
import { productRouter } from "./productRoutes.js";
import { cartRouter } from "./cartRoutes.js";
import { wishlistRouter } from "./wishlistRoutes.js";
import { reviewRouter } from "./reviewRoutes.js";
import { orderRouter } from "./orderRoutes.js";
import { adminRouter } from "./adminRoutes.js";
import { paymentRouter } from "./paymentRoutes.js";
const router=express.Router()

router.get('/', (req, res) => {
    res.send('Hello World2!')
  });
// Middleware to parse JSON
router.use(express.json());
//user
router.use("/user",userRouter)
//seller
router.use("/seller",sellerRouter)
//admin
router.use("/admin",adminRouter)
//order
router.use( "/order",orderRouter);
//products
router.use("/products",productRouter)
//cart
router.use("/cart", cartRouter);
//wishlist
router.use("/wishlist",wishlistRouter);
//REVIEW
router.use("/review",reviewRouter);
//payment
router.use("/payment",paymentRouter);

export { router as apiRouter };
