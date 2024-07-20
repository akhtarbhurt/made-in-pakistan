import { ApiError } from "../utils/ApiError";
import { Tag, ITag } from "../models/tag.models";
import { asyncHandler } from "../utils/asyncHandler";
import {Request, Response, NextFunction} from "express"
import { ApiResponse } from "../utils/ApiResponse";

interface TagRequestBody {
    title: string;
    status: string;
}

interface CustomRequest extends Request {
    body: TagRequestBody;
}
const tagController = asyncHandler(async(req: CustomRequest, res : Response, next: NextFunction)=>{
    try {
        const {title, status} = req.body
        const payload = await Tag.create({title, status})
        await payload.save()
        if(!payload) throw new ApiError(400, "no data created at Tag")
        return res.status(200).json(new ApiResponse(200, payload, "Tag created successfully"))
    } catch (error) {
        next(error)
    }
})

const getTagController = asyncHandler(async(req: CustomRequest, res: Response, next: NextFunction)=>{
    try {
        const payload = await Tag.find()
        if(!payload.length) throw new ApiError(400, "no data found in Tag")
        return res.status(200).json(new ApiResponse(200, payload, "data retrieved successfully"))
    } catch (error) {
        next(error)
    }
})

const updateTagController = asyncHandler(async(req: CustomRequest, res: Response, next: NextFunction)=>{
    try {
        const {id} = req.params
        const payload = await Tag.findByIdAndUpdate(id, {...req.body}, {new: true}) 
        if(!payload) throw new ApiError(400, "update failed !")       
        return res.status(200).json(new ApiResponse(200, payload, "updated successfully"))
    } catch (error) {
        next(error)
    }
})
const deleteTagController = asyncHandler(async(req: CustomRequest, res: Response, next: NextFunction)=>{
    try {
        const {id} = req.params
        const payload = await Tag.findByIdAndDelete(id) 
        if(!payload) throw new ApiError(400, "delete failed !")       
        return res.status(200).json(new ApiResponse(200, payload, "deleted successfully"))
    } catch (error) {
        next(error)
    }
})

export {tagController, getTagController, updateTagController, deleteTagController}