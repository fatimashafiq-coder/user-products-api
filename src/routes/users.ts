import express from "express";
import fs from "fs";
import validateUser from "../middlewares/userMiddleware";
import { v4 as uuidv4 } from "uuid";
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
dotenv.config();
const router = Router();

interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}
const usersFilePath = path.join(process.cwd(), './usersDetails.json');

const readUsers = (): User[] => {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf-8');
        return JSON.parse(data) as User[];
    } catch (err) {
        return [];
    }
};

const writeUsers = (users: User[]): void => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

router.post('/userSignup', validateUser, (req, res) => {
    const { name, email, password } = req.body;
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: "Error hashing password" });
        }
        const usersDetails = readUsers();

        if (usersDetails.find(u => u.email === email)) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const newUser: User = {
            id: uuidv4(),
            name,
            email,
            password: hashedPassword
        };
        usersDetails.push(newUser);
        writeUsers(usersDetails);
        return res.status(201).json({
            message: "User Signup Successfully",
            userId: newUser.id
        });
    });
});

router.post('/userLogin', (req, res) => {
    const { email, password } = req.body;
    const usersDetails = readUsers();
    const user = usersDetails.find(u => u.email === email);

    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }
    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
            return res.status(500).json({ message: "Error comparing passwords" });
        }
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );
        return res.status(200).json({ message: "Login successful", token });
    });
});

router.put('/userUpdate/:id', (req, res) => {
    const id = req.params.id;
    const { password } = req.body;
    const usersDetails = readUsers();
    const userIndex = usersDetails.findIndex(u => u.id === id);
    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
    }
    if (!password) {
        return res.status(400).json({ error: "Password is required" });
    }
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: "Error hashing password" });
        }

        const user = usersDetails[userIndex];
        if (user) {
            user.password = hashedPassword;
            writeUsers(usersDetails);
            return res.status(200).json({
                message: "Password updated successfully",
                userId: user.id
            });
        }
    });
});

router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const usersDetails = readUsers();
    const userIndex = usersDetails.findIndex((user) => user.id === id);
    if (userIndex === -1) {
        return res.status(404).json({
            error: "User not found",
        });
    }
    const deletedUser = usersDetails.splice(userIndex, 1);
    writeUsers(usersDetails);

    return res.status(200).json({
        message: "User deleted successfully",
    });
});

export default router;