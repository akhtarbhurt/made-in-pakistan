import { ApiError } from "../utils/ApiError";
import { Review } from "../models/review.models";
import { asyncHandler } from "../utils/asyncHandler";
import {Request, Response, NextFunction} from "express"
import { ApiResponse } from "../utils/ApiResponse";

interface ReviewRequestBody {
    reviewBy: string;
    productTitle: string;
    review: string;
    rate: string 
    status: string
    
}

interface CustomRequest extends Request {
    body: ReviewRequestBody;
}
const reviewController = asyncHandler(async(req: CustomRequest, res : Response, next: NextFunction)=>{
    try {
        const {reviewBy, productTitle, review, rate,  status} = req.body
        const payload = await Review.create({reviewBy, productTitle, review, rate,  status})
        await payload.save()
        if(!payload) throw new ApiError(400, "no data created at Review")
        return res.status(200).json(new ApiResponse(200, payload, "Review created successfully"))
    } catch (error) {
        next(error)
    }
})

const getReviewController = asyncHandler(async(req: CustomRequest, res: Response, next: NextFunction)=>{
    try {
        const payload = await Review.find()
        if(!payload.length) throw new ApiError(400, "no data found in Review")
        return res.status(200).json(new ApiResponse(200, payload, "data retrieved successfully"))
    } catch (error) {
        next(error)
    }
})

const updateReviewController = asyncHandler(async(req: CustomRequest, res: Response, next: NextFunction)=>{
    try {
        const {id} = req.params
        const payload = await Review.findByIdAndUpdate(id, {...req.body}, {new: true}) 
        if(!payload) throw new ApiError(400, "update failed !")       
        return res.status(200).json(new ApiResponse(200, payload, "updated successfully"))
    } catch (error) {
        next(error)
    }
})
const deleteReviewController = asyncHandler(async(req: CustomRequest, res: Response, next: NextFunction)=>{
    try {
        const {id} = req.params
        const payload = await Review.findByIdAndDelete(id) 
        if(!payload) throw new ApiError(400, "delete failed !")       
        return res.status(200).json(new ApiResponse(200, payload, "deleted successfully"))
    } catch (error) {
        next(error)
    }
})

export {reviewController, getReviewController, updateReviewController, deleteReviewController}