import mongoose, { Document, Schema } from "mongoose";

export interface ICoupans extends Document {
    couponCode: string,
    type: string,
    value: number,
    status: string,
}

const couppanSchema: Schema<ICoupans> = new Schema({
    couponCode:{
        type: String,
        required: true,
        trim: true
    },
    type:{
        type: String,
        required: true,
        trim: true
    },
    value:{
        type: Number,
        required: true,
        trim: true
    },
    status:{
        type: String,
        required: true,
        trim: true
    },
})

export const Coupan = mongoose.model<ICoupans>("coupan", couppanSchema)