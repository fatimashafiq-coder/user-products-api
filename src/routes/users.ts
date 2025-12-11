import validateUser from "../middlewares/userMiddleware.js";
import { Router } from "express";
import { userSignup, userLogin, updateUser, deleteUser } from "../controllers/userControllers.js";
const router = Router();

router.post('/userSignup', validateUser,userSignup);
router.post('/userLogin', userLogin);
router.put('/userUpdate/:id',updateUser);
router.delete('/userDelete/:id', deleteUser);

export default router;
