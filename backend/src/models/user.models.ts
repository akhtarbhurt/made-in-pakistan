import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    refreshToken: string | undefined;
    accessToken: string | undefined;
    role: string;
    isPasswordCorrect(password: string): Promise<boolean>;
    generateRefreshToken(): any;
    generateAccessToken(): any;
    resetPasswordToken: string | undefined ;
    resetPasswordExpires: number | undefined ;
}

const userSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
        trim: true,
        index: true,
        lowercase: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
        required: true
    },
    resetPasswordToken: {
        type: String,
        required: false,
    },
    resetPasswordExpires: {
        type: Number,
        required: false,
    },
});

userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function (): Promise<string | undefined> {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

userSchema.methods.generateRefreshToken = function (): string | undefined {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET as string,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

export const User = mongoose.model<IUser>("user", userSchema);
 