import { Response } from "express";
import Product from "../models/productModels";
import { AuthRequest } from "../types/productTypes";

export const getProductById = async (req: AuthRequest, res: Response) => {
  try {
    const result = await Product.find({ userId: req.params.userId });
    if (result.length === 0) {
      return res.status(404).json({ message: "No products found for this user" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const addProduct = async (req: AuthRequest, res: Response) => {
  const { productName } = req.body;

  if (!productName) {
    return res.status(400).json({ error: "Product name is required" });
  }

  await Product.create({
    productName,
    userId: req.user!.id,
  });

  res.status(201).json({ message: "Product added successfully" });
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  if (!req.body.productName) {
    return res.status(400).json({ error: "Product name is required" });
  }
  await Product.findByIdAndUpdate(req.params.id, req.body);
  res.status(200).json({ message: "Product updated successfully" });
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "Product deleted successfully" });
};
