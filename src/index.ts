import express from "express";
const app = express();
import userRoutes from "./routes/users"
app.use(express.json());
app.use('/', userRoutes);

app.listen(7000, () => {
    console.log("Server is running on http://localhost:7000");
});
