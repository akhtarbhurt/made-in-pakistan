import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.models';
import { ApiError } from '../utils/ApiError';
import { CustomRequest } from '../utils/customRequest';  // Adjust the import path as needed

export const verifyJWT = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

    if (!token) {
        throw new ApiError(401, 'Access token is required');
    }

    try {
        const decoded: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
        const user = await User.findById(decoded._id).select('-password -refreshToken');

        if (!user) {
            throw new ApiError(401, 'User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        next(new ApiError(401, 'Invalid or expired token'));
    }
};
