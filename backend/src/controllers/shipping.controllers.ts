import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import {Request, Response, NextFunction} from "express"
import { ApiResponse } from "../utils/ApiResponse";
import { Shipping } from "../models/shipping.models";

interface ShippingRequestBody {
    type: string;
    price: string;
    status: string;
}

interface CustomRequest extends Request {
    body: ShippingRequestBody;
}
const shippingController = asyncHandler(async(req: CustomRequest, res : Response, next: NextFunction)=>{
    try {
        const {type, price, status} = req.body
        const payload = await Shipping.create({type, price, status})
        await payload.save()
        if(!payload) throw new ApiError(400, "no data created at shipping")
        return res.status(200).json(new ApiResponse(200, payload, "shipping created successfully"))
    } catch (error) {
        next(error)
    }
})

const getShippingController = asyncHandler(async(req: CustomRequest, res: Response, next: NextFunction)=>{
    try {
        const payload = await Shipping.find()
        if(!payload.length) throw new ApiError(400, "no data found in shipping")
        return res.status(200).json(new ApiResponse(200, payload, "data retrieved successfully"))
    } catch (error) {
        next(error)
    }
})

const updateShippingController = asyncHandler(async(req: CustomRequest, res: Response, next: NextFunction)=>{
    try {
        const {id} = req.params
        const payload = await Shipping.findByIdAndUpdate(id, {...req.body}, {new: true}) 
        if(!payload) throw new ApiError(400, "update failed !")       
        return res.status(200).json(new ApiResponse(200, payload, "updated successfully"))
    } catch (error) {
        next(error)
    }
})
const deleteShippingController = asyncHandler(async(req: CustomRequest, res: Response, next: NextFunction)=>{
    try {
        const {id} = req.params
        const payload = await Shipping.findByIdAndDelete(id) 
        if(!payload) throw new ApiError(400, "delete failed !")       
        return res.status(200).json(new ApiResponse(200, payload, "deleted successfully"))
    } catch (error) {
        next(error)
    }
})

export {shippingController, getShippingController, updateShippingController, deleteShippingController}