import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response, NextFunction, response } from "express";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { ApiResponse } from "../utils/ApiResponse";
import { Posts} from "../models/post.models"

interface CustomRequest extends Request {
    body: PostRequestBody;
}

interface PostRequestBody{
    title: string;
    quote: string;
    summary: string;
    description: string;
    postImage: string;
    Post: string;
    tag: string;
    category: string
    author: string;
    status: string;
    logo: string
}

const postController = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      try {
        const { title, quote, summary, description, category, postImage, Post, tag, author, status }: PostRequestBody = req.body;
        const avatarLocalPath = req.file?.path;
        if (!avatarLocalPath) {
          throw new ApiError(400, " Post image is required");
        }
        const avatar = await uploadOnCloudinary(avatarLocalPath);
        const payload = await Posts.create({title, quote, summary, category, description, postImage : avatar?.url, Post, tag, author, status})
        if (!payload)
          throw new ApiError(400, "There is no data found in banner");
        return res
          .status(200)
          .json(new ApiResponse(200, payload, "Post added successfully"));
      } catch (error: any) {
        next(error);
      }
    }
  );
  
  const updatePostController = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        let imageUrl : any = req.body?.logo;
        if (req.file) {
          const avatar = await uploadOnCloudinary(req.file.path);
          imageUrl = avatar?.url;
        }
        const payload = await Posts.findByIdAndUpdate(
          id,
          { ...req.body, postImage: imageUrl },
          { new: true }
        );
        if (!payload) throw new ApiError(400, "Update failed");
        return res
          .status(200)
          .json(new ApiResponse(200, payload, "Updated successfully"));
      } catch (error: any) {
        next(error);
      }
    }
  );
  
  const deletePostController = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        const payload = await Posts.findByIdAndDelete(id);
        if (!payload) throw new ApiError(400, "Delete failed");
        return res
          .status(200)
          .json(new ApiResponse(200, payload, "Deleted successfully"));
      } catch (error: any) {
        next(error);
      }
    }
  );
  
  const getPostController = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      try {
        const payload = await Posts.find();
        if (!payload.length) {
          throw new ApiError(400, "No data found in Post controller");
        }
        return res
          .status(200)
          .json(new ApiResponse(200, payload, "Data retrieved successfully"));
      } catch (error: any) {
        next(error);
      }
    }
  );
  

export {postController, getPostController, updatePostController, deletePostController}