import express from "express";
import fs from "fs";
import usersDetails from "../data/usersDetails.json"
import validateUser from "../middlewares/userMiddleware";
import { v4 as uuidv4 } from "uuid";
import { Router } from "express";
import bycrypt from "bcrypt";
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
    bycrypt.hash(password, saltRounds, (err, hashedPassword) => {
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



export default router;
