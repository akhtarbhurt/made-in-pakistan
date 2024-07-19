import { asyncHandler } from "../utils/asyncHandler";
import { Banner, IBanner } from "../models/banners.models";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { ApiResponse } from "../utils/ApiResponse";

interface CustomRequest extends Request {
  [x: string]: any;
  user?: IBanner;
}

interface BannerRequestBody {
  title: string;
  description: string;
  bannerImage: string;
  status: string;
}

const bannerControllers = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const { title, description, bannerImage, status }: BannerRequestBody = req.body;
      const avatarLocalPath = req.file?.path;
      if (!avatarLocalPath) {
        throw new ApiError(400, "Banner image is required");
      }
      const avatar = await uploadOnCloudinary(avatarLocalPath);
      const payload = await Banner.create({
        title,
        description,
        bannerImage: avatar?.url,
        status,
      });
      if (!payload)
        throw new ApiError(400, "There is no data found in banner");
      return res
        .status(200)
        .json(new ApiResponse(200, payload, "Banner added successfully"));
    } catch (error: any) {
      next(error);
    }
  }
);

const updateBannerControllers = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      let imageUrl = req.body.logo;
      if (req.file) {
        const avatar = await uploadOnCloudinary(req.file.path);
        imageUrl = avatar?.url;
      }
      const payload = await Banner.findByIdAndUpdate(
        id,
        { ...req.body, bannerImage: imageUrl },
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

const deleteBannerController = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const payload = await Banner.findByIdAndDelete(id);
      if (!payload) throw new ApiError(400, "Delete failed");
      return res
        .status(200)
        .json(new ApiResponse(200, payload, "Deleted successfully"));
    } catch (error: any) {
      next(error);
    }
  }
);

const getBannerController = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const payload = await Banner.find();
      if (!payload.length) {
        throw new ApiError(400, "No data found in banner controller");
      }
      return res
        .status(200)
        .json(new ApiResponse(200, payload, "Data retrieved successfully"));
    } catch (error: any) {
      next(error);
    }
  }
);

export { bannerControllers, updateBannerControllers, deleteBannerController, getBannerController };
