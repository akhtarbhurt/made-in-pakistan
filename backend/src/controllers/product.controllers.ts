import { Request, Response, NextFunction } from "express";
import { Product } from "../models/product.models"; // Adjust the path as necessary
import { uploadOnCloudinary } from "../utils/cloudinary"; // Adjust the path as necessary
import { asyncHandler } from "../utils/asyncHandler"; // Adjust the path as necessary
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

interface ProductionRequestBody {
  title: string;
  summary: string;
  description: string;
  isFeature: boolean;
  category: string;
  price: number;
  discount: number;
  size: number;
  brand: string;
  condition: string;
  quantity: number;
  status: string;
}

interface CustomRequest extends Request {
  body: ProductionRequestBody;
  files: {
    photo?: Express.Multer.File[];
    addMoreImages?: Express.Multer.File[];
    video?: Express.Multer.File[];
  };
}

const postController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customReq = req as CustomRequest;
      const {
        title,
        summary,
        description,
        isFeature,
        category,
        price,
        discount,
        size,
        brand,
        condition,
        quantity,
        status,
      } = customReq.body;

      let photoUrl: string | any = "";
      let videoUrl: string | any = "";
      let additionalImages: string[] = [];

      if (customReq.files) {
        if (customReq.files.photo && customReq.files.photo[0]) {
          const photoResponse = await uploadOnCloudinary(
            customReq.files.photo[0].path
          );
          photoUrl = photoResponse?.secure_url;
        }

        if (customReq.files.addMoreImages) {
          for (const file of customReq.files.addMoreImages) {
            const imageResponse: string | any = await uploadOnCloudinary(
              file.path
            );
            additionalImages.push(imageResponse?.secure_url);
          }
        }

        if (customReq.files.video && customReq.files.video[0]) {
          const videoResponse = await uploadOnCloudinary(
            customReq.files.video[0].path
          );
          videoUrl = videoResponse?.secure_url;
        }
      }

      const payload = await Product.create({
        title,
        summary,
        description,
        isFeature,
        category,
        price,
        discount,
        size,
        brand,
        condition,
        quantity,
        photo: photoUrl,
        addMoreImages: additionalImages,
        video: videoUrl,
        status,
      });

      if (!payload) throw new ApiError(400, "no data found");

      res
        .status(201)
        .json(new ApiResponse(200, payload, "data added successfully"));
    } catch (error) {
      next(error);
    }
  }
);

const updateController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customReq = req as CustomRequest;
      const { id } = req.params;
      const {
        title,
        summary,
        description,
        isFeature,
        category,
        price,
        discount,
        size,
        brand,
        condition,
        quantity,
        status,
      } = customReq.body;

      let photoUrl: string | any = "";
      let videoUrl: string | any = "";
      let additionalImages: string[] = [];

      if (customReq.files) {
        if (customReq.files.photo && customReq.files.photo[0]) {
          const photoResponse = await uploadOnCloudinary(
            customReq.files.photo[0].path
          );
          photoUrl = photoResponse?.secure_url;
        }

        if (customReq.files.addMoreImages) {
          for (const file of customReq.files.addMoreImages) {
            const imageResponse: string | any = await uploadOnCloudinary(
              file.path
            );
            additionalImages.push(imageResponse?.secure_url);
          }
        }

        if (customReq.files.video && customReq.files.video[0]) {
          const videoResponse = await uploadOnCloudinary(
            customReq.files.video[0].path
          );
          videoUrl = videoResponse?.secure_url;
        }
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
          title,
          summary,
          description,
          isFeature,
          category,
          price,
          discount,
          size,
          brand,
          condition,
          quantity,
          photo: photoUrl,
          addMoreImages: additionalImages,
          video: videoUrl,
          status,
        },
        { new: true }
      );
      if (!updatedProduct)
        throw new ApiError(400, "failed to update the product");
      res
        .status(200)
        .json(
          new ApiResponse(200, updatedProduct, "product updated successfully")
        );
    } catch (error) {
      next(error);
    }
  }
);

const getController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await Product.find();

      if (!product.length) {
        throw new ApiError(400, "failed to get product");
      }

      res
        .status(200)
        .json(new ApiResponse(200, product, "data retrieved successfully"));
    } catch (error) {
      next(error);
    }
  }
);

const deleteController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const product = await Product.findByIdAndDelete(id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
);

export { postController, updateController, getController, deleteController };
