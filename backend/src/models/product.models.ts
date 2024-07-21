import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
    title: string;
    summary: string;
    description: string;
    isFeature: boolean;
    category: string;
    price: number;
    discount: number;
    size: number;
    brand: string;
    condition: string;
    quantity: number;
    photo: string;
    addMoreImages: [] | any;
    video: string;
    status: string
}

const productSchema : Schema<IProduct> = new Schema({
    title : {
        type: String,
        trime: true,
        required: true
    },
    summary : {
        type: String,
        trime: true,
        required: true
    },
    description : {
        type: String,
        trime: true,
        required: true
    },
    isFeature:{
        type: Boolean,
        trim: true,
        required: true
    },
    price : {
        type: Number,
        trim: true,
        required: true
    },
    discount : {
        type: Number,
        trime: true,
        required: true
    },
    size : {
        type: Number,
        trime: true,
        required: true
    },
    brand : {
        type: String,
        trime: true,
        required: true
    },
    condition : {
        type: String,
        trime: true,
        required: true
    },
    quantity : {
        type: Number,
        trime: true,
        required: true
    },
    photo:{
        type: String,
        trime: true,
        required: true
    },
    addMoreImages : {
        type: Array,
        required: true
    },
    video : {
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true,
        trim: true
    }
})

export const Product = mongoose.model<IProduct>("product", productSchema)