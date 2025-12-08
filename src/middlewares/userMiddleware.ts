import { Request, Response, NextFunction } from "express";

const validateUser = (req: Request, res: Response, next: NextFunction) => {
    if ((!req.body.name) || (!req.body.email) || (!req.body.password)) {
        return res.status(400).json({ error: "Empty Body not allowed" });
    }
    next();
};
export default validateUser;
