import express from "express";
const app = express();
import userRoutes from "./routes/users"
const productsRoutes =  require('./routes/products');
app.use(express.json());
app.use('/', userRoutes);
app.use('/', productsRoutes)
app.listen(7000, () => {
    console.log("Server is running on http://localhost:7000");
});
