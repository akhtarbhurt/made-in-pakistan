import { ApiError } from "../utils/ApiError";
import { Category, ICategory } from "../models/category.models";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response, NextFunction, response } from "express";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { ApiResponse } from "../utils/ApiResponse";


interface CustomRequest extends Request {
    body: ICategory;
}

interface CategoryRequestBody{
    title: string,
    summary: string,
    isParent: boolean,
    parentCategory: string,
    categoryImage: string,
    status: string
}

const categoryController = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      try {
        const { title, summary, isParent, parentCategory, categoryImage, status }: CategoryRequestBody = req.body;
        const avatarLocalPath = req.file?.path;
        if (!avatarLocalPath) {
          throw new ApiError(400, " category image is required");
        }
        const avatar = await uploadOnCloudinary(avatarLocalPath);
        const payload = await Category.create({
          title,
          summary,
          isParent,
          parentCategory,
          categoryImage: avatar?.url,
          status,
        });
        if (!payload)
          throw new ApiError(400, "There is no data found in banner");
        return res
          .status(200)
          .json(new ApiResponse(200, payload, "category added successfully"));
      } catch (error: any) {
        next(error);
      }
    }
  );
  
  const updateCategoryController = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        let imageUrl = req.body.logo;
        if (req.file) {
          const avatar = await uploadOnCloudinary(req.file.path);
          imageUrl = avatar?.url;
        }
        const payload = await Category.findByIdAndUpdate(
          id,
          { ...req.body, categoryImage: imageUrl },
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
  
  const deleteCategoryController = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        const payload = await Category.findByIdAndDelete(id);
        if (!payload) throw new ApiError(400, "Delete failed");
        return res
          .status(200)
          .json(new ApiResponse(200, payload, "Deleted successfully"));
      } catch (error: any) {
        next(error);
      }
    }
  );
  
  const getCategoryController = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      try {
        const payload = await Category.find();
        if (!payload.length) {
          throw new ApiError(400, "No data found in category controller");
        }
        return res
          .status(200)
          .json(new ApiResponse(200, payload, "Data retrieved successfully"));
      } catch (error: any) {
        next(error);
      }
    }
  );
  

export {categoryController, getCategoryController, updateCategoryController, deleteCategoryController}