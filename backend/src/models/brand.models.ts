import mongoose, { Document, Schema } from "mongoose";

export interface IBrand extends Document{
    title: string
    status: string
}

const brandSchema : Schema<IBrand> = new Schema({
    title:{
        type: String,
        trim: true,
        required: true
    },
    status:{
        type: String,
        trim: true,
        required: true
    },
})

export const Brand = mongoose.model<IBrand>("brand", brandSchema)