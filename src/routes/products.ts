import  express  from "express";
import { getProductById,addProduct ,updateProduct , deleteProduct} 
from "../controllers/productControllers.js";
const router = express.Router();
import { Request, Response } from "express";
import authenticateMiddleware from "../middlewares/productMiddleware.js";

router.get('/products/:userId', getProductById);
router.post('/addProducts', authenticateMiddleware, addProduct)
router.put('/updateProduct/:id', authenticateMiddleware, updateProduct);
router.delete('/deleteProduct/:id', authenticateMiddleware, deleteProduct);

module.exports = router;
