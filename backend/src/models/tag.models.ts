import mongoose, { Document, Schema } from "mongoose";

export interface ITag extends Document{
    title: string
    status: string
}

const tagSchema : Schema<ITag> = new Schema({
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

export const Tag = mongoose.model<ITag>("tag", tagSchema)