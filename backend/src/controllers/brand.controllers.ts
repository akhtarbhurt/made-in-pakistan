import { ApiError } from "../utils/ApiError";
import { Brand, IBrand } from "../models/brand.models";
import { asyncHandler } from "../utils/asyncHandler";
import {Request, Response, NextFunction} from "express"
import { ApiResponse } from "../utils/ApiResponse";

interface BrandRequestBody {
    title: string;
    status: string;
}

interface CustomRequest extends Request {
    body: BrandRequestBody;
}
const brandController = asyncHandler(async(req: CustomRequest, res : Response, next: NextFunction)=>{
    try {
        const {title, status} = req.body
        const payload = await Brand.create({title, status})
        await payload.save()
        if(!payload) throw new ApiError(400, "no data created at brand")
        return res.status(200).json(new ApiResponse(200, payload, "brand created successfully"))
    } catch (error) {
        next(error)
    }
})

const getBrandController = asyncHandler(async(req: CustomRequest, res: Response, next: NextFunction)=>{
    try {
        const payload = await Brand.find()
        if(!payload.length) throw new ApiError(400, "no data found in brand")
        return res.status(200).json(new ApiResponse(200, payload, "data retrieved successfully"))
    } catch (error) {
        next(error)
    }
})

const updateBrandController = asyncHandler(async(req: CustomRequest, res: Response, next: NextFunction)=>{
    try {
        const {id} = req.params
        const payload = await Brand.findByIdAndUpdate(id, {...req.body}, {new: true}) 
        if(!payload) throw new ApiError(400, "update failed !")       
        return res.status(200).json(new ApiResponse(200, payload, "updated successfully"))
    } catch (error) {
        next(error)
    }
})
const deleteBrandController = asyncHandler(async(req: CustomRequest, res: Response, next: NextFunction)=>{
    try {
        const {id} = req.params
        const payload = await Brand.findByIdAndDelete(id) 
        if(!payload) throw new ApiError(400, "delete failed !")       
        return res.status(200).json(new ApiResponse(200, payload, "deleted successfully"))
    } catch (error) {
        next(error)
    }
})

export {brandController, getBrandController, updateBrandController, deleteBrandController}