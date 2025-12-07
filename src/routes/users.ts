import express from "express";
import fs from "fs";
import usersDetails from "../data/usersDetails.json"
import validateUser from "../middlewares/userMiddleware";
import { v4 as uuidv4 } from "uuid";
import { Router } from "express";
import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const router = Router();

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

const usersDetailsTyped: User[] = usersDetails as User[];

router.post('/userSignup', validateUser, (req, res) => {
    const { name, email, password } = req.body;
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: "Error hashing password" });
        }
        const newUser : User = {
            id: uuidv4(),
            name,
            email,
            password: hashedPassword
        };
        usersDetailsTyped.push(newUser);
        fs.writeFile('./usersDetails.json', JSON.stringify(usersDetailsTyped), (err) => {
            if (err) {
                return res.status(500).json({ error: "Error saving user data" });
            }
            return res.status(201).send({
                message: "User Signup Successfully",
            });
        });
    });
});

router.post('/userLogin', (req, res) => {
    const { email, password } = req.body;
    const user = usersDetailsTyped.find(u => u.email === email);
    if (!user) {
        return res.status(401).send({ message: "User not found" });
    }
     bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
            return res.status(500).send({ message: "Error comparing passwords" });
        }
        if (!isMatch) {
            return res.status(401).send({ message: "Invalid password" });
        }
        const token = jwt.sign(
            {id: user.id, email: user.email},
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        )
      
        return res.status(200).send({ message: "Login successful" , token});
    });
});

export default router;
