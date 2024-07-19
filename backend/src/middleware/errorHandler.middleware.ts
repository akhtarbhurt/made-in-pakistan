import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); 

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(new ApiResponse(err.statusCode, null, err.message, ));
  }

  return res.status(500).json(new ApiResponse(500, null, "Internal server error"));
};
