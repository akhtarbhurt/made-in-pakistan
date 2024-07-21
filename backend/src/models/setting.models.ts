import mongoose, { Document, Schema } from "mongoose"

export interface ISetting extends Document {
    footerText: string;
    aboutText: string;
    headerLogo: string;
    footerLogo: string;
    address: string;
    email: string;
    number: number
}

const settingSchema: Schema<ISetting> = new Schema({
    footerText:{
        type: String,
        trim: true,
        required: true
    },
    aboutText:{
        type: String,
        trim: true,
        required: true
    },
    headerLogo:{
        type: String,
        trim: true,
        required: true
    },
    footerLogo:{
        type: String,
        trim: true,
        required: true
    },
    address:{
        type: String,
        trim: true,
        required: true
    },
    email:{
        type: String,
        trim: true,
        required: true
    },
    number:{
        type: Number,
        trim: true,
        required: true
    }
})

export const Setting = mongoose.model<ISetting>("setting", settingSchema)