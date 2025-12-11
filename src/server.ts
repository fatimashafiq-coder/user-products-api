import express from "express";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/users.js"
import productsRoutes from "./routes/products.js"

const app = express();
app.use(express.json());
const startServer = async () => {
  await connectDB(); 
}
startServer();
app.use('/', userRoutes);
app.use('/', productsRoutes)
app.listen(7000, () => {
    console.log("Server is running on http://localhost:7000");
});

