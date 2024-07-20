import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document{
   
    orderNumber : string,
    name: string,
    email: string,
    quantity: number,
    charge: number,
    totalAmount: number,
    status: string
}

const orderSchema :  Schema<IOrder>   = new Schema({
  
    orderNumber: {
        type: String,
        trim: true,
        required: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    quantity: {
        type: Number,
        trim: true,
        required: true
    },
    charge: {
        type: Number,
        trim: true,
        required: true
    },
    totalAmount: {
        type: Number,
        trim: true,
        required: true
    },
    status:{
        type: String,
        trim: true,
        required: true
    }  
    
})

export const Order = mongoose.model<IOrder>("order", orderSchema)