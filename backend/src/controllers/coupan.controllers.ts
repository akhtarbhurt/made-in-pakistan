import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Coupan } from "../models/coupans.models";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

interface CoupanRequestBody {
    couponCode: string;
    type: string;
    value: number;
    status: string;
}

interface CustomRequest extends Request {
    body: CoupanRequestBody;
}

const couponController = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const { couponCode, type, value, status } = req.body;
        const payload = await Coupan.create({ couponCode, type, value, status });
        if (!payload) throw new ApiError(400, "Failed to create coupon");
        return res.status(200).json(new ApiResponse(200, payload, "Coupon code added successfully"));
    } catch (error) {
        next(error);
    }
});

const getAllCouponsController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const coupons = await Coupan.find();
        if (!coupons.length) throw new ApiError(404, "No coupons found");
        return res.status(200).json(new ApiResponse(200, coupons, "Coupons retrieved successfully"));
    } catch (error) {
        next(error);
    }
});

const getCouponByIdController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const coupon = await Coupan.find()
        if (!coupon) throw new ApiError(404, "Coupon not found");
        return res.status(200).json(new ApiResponse(200, coupon, "Coupon retrieved successfully"));
    } catch (error) {
        next(error);
    }
});

// Update Coupon Controller
const updateCouponController = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const coupon = await Coupan.findByIdAndUpdate(id, {...req.body}, {new: true}  );
        if (!coupon) throw new ApiError(404, "Coupon not found");
        return res.status(200).json(new ApiResponse(200, coupon, "Coupon updated successfully"));
    } catch (error) {
        next(error);
    }
});

// Delete Coupon Controller
const deleteCouponController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const coupon = await Coupan.findByIdAndDelete(id);
        if (!coupon) throw new ApiError(404, "Coupon not found");
        return res.status(200).json(new ApiResponse(200, null, "Coupon deleted successfully"));
    } catch (error) {
        next(error);
    }
});

export {
    couponController,
    getAllCouponsController,
    getCouponByIdController,
    updateCouponController,
    deleteCouponController
};
