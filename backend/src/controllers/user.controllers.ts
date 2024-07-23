import { Request, Response, NextFunction, CookieOptions } from "express";
import { User, IUser } from "../models/user.models";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from 'crypto';
import bcrypt from "bcrypt"

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

const generateAccessAndRefreshTokens = async (userId: any) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

// Register user handler
const userRegistration = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { name, email, password }: UserRegistrationRequestBody = req.body;

    // Check whether the user exists or not
    const existUser = await User.findOne({ email });
    if (existUser) {
      throw new ApiError(400, "email already exists");
    }

    // Create the user
    const payload = await User.create({
      name,
      email,

      password,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, payload, "User created successfully"));
  }
);

// User login handler
const userLogin = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const { email, password }: UserLoginRequestBody = req.body;

      if (!(password || email)) {
        throw new ApiError(400, "Invalid credentials");
      }

      const user = await User.findOne({
        email,
      });

      if (!user) {
        throw new ApiError(400, "email does not exist");
      }

      const isPasswordValid = await user.isPasswordCorrect(password);

      if (!isPasswordValid) {
        throw new ApiError(400, "invalid user credential");
      }

      const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(user._id);

      console.log("Generated access login token:", accessToken);

      const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
      );

      const options: CookieOptions = {
        httpOnly: true,
        sameSite: "strict",
      };
      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
          new ApiResponse(
            200,
            {
              user: loggedInUser,
              accessToken,
              refreshToken,
            },
            "User logged In Successfully"
          )
        );
    } catch (error) {
      next(error);
    }
  }
);

// Logout the user handler
const logoutUser = asyncHandler(async (req: CustomRequest, res) => {
  await User.findByIdAndUpdate(
    req?.user?._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options: CookieOptions = {
    httpOnly: false,
    sameSite: "strict",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken: any = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed"
        )
      );
  } catch (error: any) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const getCurrentUser = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    return res
      .status(200)
      .json(
        new ApiResponse(200, req?.user, "current user fetched successfully")
      );
  }
);

const generateResetToken = (): string => {
    return crypto.randomBytes(32).toString('hex');
};

const sendResetEmail = async (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "a71899af5ab622",
      pass: "6fc90e1362b7ad",
    },
  });

  const resetURL = `http://${process.env.FRONTEND_URL}/reset-password/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Password Reset Request",
    text: `You requested a password reset. Please make a PUT request to the following URL to reset your password: ${resetURL}`,
  };

  await transporter.sendMail(mailOptions);
};

// Password reset request handler
const requestPasswordReset = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    const resetToken = generateResetToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    await sendResetEmail(email, resetToken);

    return res.status(200).json(new ApiResponse(200, {}, 'Password reset email sent successfully'));
});

// Password reset handler
const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { password, confirmPassword, token } = req.body;

    if (password !== confirmPassword) {
      throw new ApiError(400, "Password donot match")
    }

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        throw new ApiError(400, 'Password reset token is invalid or has expired');
    }

    user.password = password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json(new ApiResponse(200, {}, 'Password reset successful'));
});


export {
  userRegistration,
  userLogin,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  requestPasswordReset,
  resetPassword
};
