import user from "../models/userModels.js";
import { Request,Response} from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userSignup = async (req : Request, res : Response) => {
    const { name, email, password } = req.body;
    try {
        const hashed = await bcrypt.hash(password, 10);
        await user.create({ name, email, password: hashed });
        res.status(201).json({ message: "User Signup Successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error creating user" });
    }
};

export const userLogin = async (req : Request, res  : Response) => {
    const { email, password } = req.body;
    const User = await user.findOne({ email });
    if (!User) return res.status(401).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, User.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
        { id: User.id, email: User.email },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
    );

    res.status(200).json({ message: "Login successful", token });
};
export const updateUser = async (req : Request, res : Response) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ error: "Password is required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await user.findByIdAndUpdate(
            req.params.id,
            { password: hashedPassword },
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            message: "Password updated successfully",
        });

    } catch (err) {
        return res.status(500).json({ error: "Error updating password" });
    }
}

export const deleteUser = async (req : Request, res: Response) => {
    await user.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
};


