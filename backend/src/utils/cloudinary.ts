import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: "dfryqj5cn",
    api_key: "945825629133348",
    api_secret: "LDQnz-VtdrnG0zq8POMiih3RVVQ"
});

const uploadOnCloudinary = async (localFilePath: string) => {
    try {
        if (!localFilePath) {
            return null;
        } else {
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto"
            });
            fs.unlinkSync(localFilePath);
            return response;
        }
    } catch (error) {
        console.log(error);
    }
};

export { uploadOnCloudinary };
