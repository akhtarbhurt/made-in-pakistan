import { Request, Response, NextFunction, CookieOptions } from 'express';
import { User, IUser } from '../models/user.models';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import jwt from "jsonwebtoken"

// Interface for the request body in userRegistration handler
interface UserRegistrationRequestBody {
    name: string;
    email: string;
    phone: number;
    password: string;
}

// Interface for the request body in userLogin handler
interface UserLoginRequestBody {
    email: string;
    password: string;
}

// Custom Request interface that extends the Express.Request interface
interface CustomRequest extends Request {
    user?: IUser;
}

// Handler to generate refresh and access tokens
// Handler to generate refresh and access tokens
// Handler to generate refresh and access tokens
const generateAccessAndRefreshTokens = async (userId: any) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, 'Something went wrong while generating refresh and access token');
    }
};



// Register user handler
const userRegistration = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { name, email,  password }: UserRegistrationRequestBody = req.body;

    // Check whether the user exists or not
    const existUser = await User.findOne({ email });
    if (existUser) {
        throw new ApiError(400, 'email already exists')
    }

    

    // Create the user
    const payload = await User.create({
        name,
        email,
      
        password,
    });
    return res.status(200).json(new ApiResponse(200, payload, 'User created successfully'));
});

// User login handler
const userLogin = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
   try {
    const { email, password }: UserLoginRequestBody = req.body;
    
    if (!(password || email)) {
        throw new ApiError(400, "Invalid credentials");
    }

    const user = await User.findOne({
        email
    });

    if (!user) {
        throw new ApiError(400, "email does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(400, "invalid user credential")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    console.log('Generated access login token:', accessToken);

    const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

    const options : CookieOptions = {
        httpOnly: true,
        sameSite: 'strict',
        
    }
    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                'User logged In Successfully'
            )
        );
   } catch (error) {
    next(error)
   }
});

// Logout the user handler
const logoutUser = asyncHandler(async (req: CustomRequest, res) => {
    await User.findByIdAndUpdate(
        req?.user?._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options : CookieOptions = {
        httpOnly: false,
        sameSite: 'strict',
        
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken : any = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET as string
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")

        }

        const options = {
            httpOnly: true,
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken",refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error : any ) {
        throw new ApiError(401, error?.message || "Invalid refresh token") 
    }
})

const getCurrentUser = asyncHandler(async (req : CustomRequest , res : Response ) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req?.user, "current user fetched successfully"))
})

export { userRegistration, userLogin, logoutUser, refreshAccessToken, getCurrentUser };
