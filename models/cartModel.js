import mongoose,{Schema} from "mongoose";
const cartSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                }
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

cartSchema.pre("save", async function (next) {
    this.totalPrice = this.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    next();
});

export const Cart = mongoose.model("Cart", cartSchema);
