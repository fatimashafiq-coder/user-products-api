import mongoose from "mongoose"
const productSchema = new mongoose.Schema(
    {
        productName: { 
            type: String,
             required: [true, "product name is required"] ,
        },
        userId: { type: String }
    },
    { timestamps: true }
)
const product = mongoose.model("product", productSchema)

export default product;
