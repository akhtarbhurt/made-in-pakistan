import mongoose, { Document, Schema } from "mongoose";

export interface IShipping extends Document{
    type: string,
    price: string,
    status: string
}

const shippingSchema : Schema<IShipping> = new Schema({
    price:{
        type: String,
        trim: true,
        required: true
    },
    type:{
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

export const Shipping = mongoose.model<IShipping>("shipping", shippingSchema)