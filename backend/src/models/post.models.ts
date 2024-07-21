import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
    title: string;
    quote: string;
    summary: string;
    description: string;
    category: string;
    tag: string;
    author: string;
    postImage: string;
    status: string
}

const postSchema : Schema<IPost> = new Schema({
    title:{
        type: String,
        trim: true,
        required: true
    },
    quote:{
        type: String,
        trim: true,
        required: true
    },
    summary:{
        type: String,
        trim: true,
        required: true
    },
    description:{
        type: String,
        trim: true,
        required: true
    },
    category:{
        type: String,
        trim: true,
        required: true
    },
    tag:{
        type: String,
        trim: true,
        required: true
    },
    author :{
        type: String,
        trim: true,
        required: true
    },
    postImage:{
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

export const Posts = mongoose.model<IPost>("post", postSchema)