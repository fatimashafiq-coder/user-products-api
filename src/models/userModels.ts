import mongoose from "mongoose"
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            minlength: [3, "Name must be at least 3 characters"],
            maxlength: [50, "Name must be less than 50 characters"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "email is required"],
            unique: true
        },
        password: {
            type: String,
            required: [true, "password is required"],
            min: [3, 'Too small password'],
            max: 12
        }
    },
    { timestamps: true }
)
export default mongoose.model("user", userSchema);
