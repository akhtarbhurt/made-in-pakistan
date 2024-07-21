import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { Setting } from "../models/setting.models";
import { ApiResponse } from "../utils/ApiResponse";

interface SettingRequestBody {
    footerText: string;
    aboutText: string;
    headerLogo: string;
    footerLogo: string;
    address: string;
    email: string;
    number: number;
}

interface CustomRequest extends Request {
    body: SettingRequestBody;
    files: { [fieldname: string]: Express.Multer.File[] };
}
const settingController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customReq = req as CustomRequest;
        const { footerText, aboutText, address, email, number } = customReq.body;

        console.log('Files: ', customReq.files); // Log the files object

        const footerLogoFile = customReq.files['footerLogo']?.[0]?.path;
        const headerLogoFile = customReq.files['headerLogo']?.[0]?.path;

        if (!headerLogoFile) {
            throw new ApiError(400, 'Header logo is required');
        }
        if (!footerLogoFile) {
            throw new ApiError(400, 'Footer logo is required');
        }

        const footerLogoUpload = await uploadOnCloudinary(footerLogoFile);
        const headerLogoUpload = await uploadOnCloudinary(headerLogoFile);

        const payload = await Setting.create({
            footerText,
            aboutText,
            headerLogo: headerLogoUpload?.url,
            footerLogo: footerLogoUpload?.url,
            address,
            email,
            number
        });

        if (!payload) throw new ApiError(400, "Failed to save settings");

        return res.status(201).json(new ApiResponse(201, payload, "Settings saved successfully"));
    } catch (error) {
        next(error);
    }
});

const getSettingController = asyncHandler(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const payload = await Setting.find()
        if(!payload.length) throw new ApiError(400, "no data found")
        return res.status(200).json(new ApiResponse(200, payload, 'data retrieved successfully'))
    } catch (error) {
        next(error)
    }
})

const updateSettingController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const customReq = req as CustomRequest;
        const { footerText, aboutText, address, email, number } = customReq.body;

        // Find the existing setting
        const setting = await Setting.findById(id);
        if (!setting) {
            throw new ApiError(404, 'Setting not found');
        }

        // Handle file uploads if new files are provided
        let headerLogoUrl : any = setting.headerLogo;
        let footerLogoUrl : any = setting.footerLogo;

        if (customReq.files) {
            if (customReq.files['headerLogo'] && customReq.files['headerLogo'][0]) {
                const headerLogoFile = customReq.files['headerLogo'][0].path;
                const headerLogoUpload = await uploadOnCloudinary(headerLogoFile);
                headerLogoUrl = headerLogoUpload?.url;
            }
            if (customReq.files['footerLogo'] && customReq.files['footerLogo'][0]) {
                const footerLogoFile = customReq.files['footerLogo'][0].path;
                const footerLogoUpload = await uploadOnCloudinary(footerLogoFile);
                footerLogoUrl = footerLogoUpload?.url;
            }
        }

        // Update the setting with new data
        setting.footerText = footerText || setting.footerText;
        setting.aboutText = aboutText || setting.aboutText;
        setting.headerLogo = headerLogoUrl;
        setting.footerLogo = footerLogoUrl;
        setting.address = address || setting.address;
        setting.email = email || setting.email;
        setting.number = number || setting.number;

        await setting.save();

        return res.status(200).json(new ApiResponse(200, setting, "Settings updated successfully"));
    } catch (error) {
        next(error);
    }
});

const deleteSettingController = asyncHandler(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const {id} = req.params
        const payload = await Setting.findByIdAndDelete(id)
        if(!payload) throw new ApiError(400, 'failed delete')
        return res.status(200).json(new ApiResponse(200, payload, "delete successfull"))
    } catch (error) {
        next(error)
    }
})

export { settingController, updateSettingController, getSettingController, deleteSettingController };
