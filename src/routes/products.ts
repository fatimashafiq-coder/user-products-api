const express = require('express');
const router = express.Router();
import { Request, Response, NextFunction } from "express";
import authenticateMiddleware from "../middlewares/productMiddleware";
const fs = require("fs");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import path from "path"
require('dotenv').config(); 

interface Product {
    productName: string;
     userId: string;
}

interface AuthRequest extends Request {
    user: {
        id: string;
        email: string;
    };
}
const productsFilePath = path.join(process.cwd(), 'data/products.json');

const readProducts = (): Product[] => {
    try {
        const data = fs.readFileSync(productsFilePath, 'utf-8');
        return JSON.parse(data) as Product[];
    } catch (err) {
        return [];
    }
};
const writeProducts = (products: Product[]): void => {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

router.get('/products', (req : Request, res : Response) => {
    const products = readProducts();
    return res.status(200).send(JSON.stringify(products))
})
router.get('/products/:id', (req: Request, res: Response) => {
    const userId = req.params.id;
    const products = readProducts();
    const userProducts = products.filter((product) => product.userId === userId);
    
    if (userProducts.length === 0) {
        return res.status(404).json({ message: "No products found for this user" });
    }
    
    return res.status(200).json(userProducts);
});

router.post('/addProducts', authenticateMiddleware, (req: AuthRequest, res: Response) => {
    const { productName } = req.body;
    if (!productName) {
        return res.status(400).json({ error: "Product name is required" });
    }
    const newProduct: Product = {
        productName,
        userId: req.user.id
    };
     const products = readProducts();
    products.push(newProduct);
    writeProducts(products);
    
    return res.status(201).json({
        message: "Product added successfully",
        product: newProduct
    });
})

module.exports = router;
