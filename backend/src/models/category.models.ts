import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
    logo: any;
    title: string,
    summary: string,
    isParent: boolean,
    parentCategory: string
    categoryImage: string,
    status: string
}

const categorySchema : Schema<ICategory> = new Schema({
    title:{
        type: String,
        trim: true,
        required: true
    },
    summary:{
        type: String,
        trim: true,
        required: true
    },
    isParent:{
        type: Boolean
    },
    parentCategory:{
        type: String,
        trim: true
    },
    categoryImage:{
        type: String,
        // required: true
    },
    status: {
        type: String,
        required: true
    }
})

export const Category = mongoose.model<ICategory>('category', categorySchema)