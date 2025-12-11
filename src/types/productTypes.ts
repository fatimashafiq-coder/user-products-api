import { Request } from "express";

interface Product {
    productName: string;
    userId: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}
