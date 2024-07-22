import { Response, NextFunction } from "express";
import { User } from "../models/user.models";
import { ApiError } from "../utils/ApiError";
import { CustomRequest } from "../utils/customRequest";  // Adjust the import path as needed

export const verifyRole = (roles: string[]) => {
    return async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const user = await User.findById(req.user?._id);
            if (!user || !roles.includes(user.role)) {
                throw new ApiError(403, "Forbidden");
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};
