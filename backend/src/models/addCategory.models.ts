import mongoose, { Document, Schema } from "mongoose";

export interface AddCategory extends Document{
    title: string
    status: string
}

const addCategorySchema : Schema<AddCategory> = new Schema({
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

export const AddCategory = mongoose.model<AddCategory>("addCategory", addCategorySchema)