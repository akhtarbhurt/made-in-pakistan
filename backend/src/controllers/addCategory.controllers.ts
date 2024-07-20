import { ApiError } from "../utils/ApiError";
import { AddCategory } from "../models/addCategory.models";
import { asyncHandler } from "../utils/asyncHandler";
import {Request, Response, NextFunction} from "express"
import { ApiResponse } from "../utils/ApiResponse";

interface AddCategoryRequestBody {
    title: string;
    status: string;
}

interface CustomRequest extends Request {
    body: AddCategoryRequestBody;
}
const addCategoryController = asyncHandler(async(req: CustomRequest, res : Response, next: NextFunction)=>{
    try {
        const {title, status} = req.body
        const payload = await AddCategory.create({title, status})
        await payload.save()
        if(!payload) throw new ApiError(400, "no data created at AddCategory")
        return res.status(200).json(new ApiResponse(200, payload, "AddCategory created successfully"))
    } catch (error) {
        next(error)
    }
})

const getAddCategoryController = asyncHandler(async(req: CustomRequest, res: Response, next: NextFunction)=>{
    try {
        const payload = await AddCategory.find()
        if(!payload.length) throw new ApiError(400, "no data found in AddCategory")
        return res.status(200).json(new ApiResponse(200, payload, "data retrieved successfully"))
    } catch (error) {
        next(error)
    }
})

const updateAddCategoryController = asyncHandler(async(req: CustomRequest, res: Response, next: NextFunction)=>{
    try {
        const {id} = req.params
        const payload = await AddCategory.findByIdAndUpdate(id, {...req.body}, {new: true}) 
        if(!payload) throw new ApiError(400, "update failed !")       
        return res.status(200).json(new ApiResponse(200, payload, "updated successfully"))
    } catch (error) {
        next(error)
    }
})
const deleteAddCategoryController = asyncHandler(async(req: CustomRequest, res: Response, next: NextFunction)=>{
    try {
        const {id} = req.params
        const payload = await AddCategory.findByIdAndDelete(id) 
        if(!payload) throw new ApiError(400, "delete failed !")       
        return res.status(200).json(new ApiResponse(200, payload, "deleted successfully"))
    } catch (error) {
        next(error)
    }
})

export {addCategoryController, getAddCategoryController, updateAddCategoryController, deleteAddCategoryController}