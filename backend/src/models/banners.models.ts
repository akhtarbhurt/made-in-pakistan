import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the Banner document
 export interface IBanner extends Document {
  title: string;
  description: string;
  bannerImage: string  ;
  status: string;
}

const bannerSchema: Schema<IBanner> = new Schema({
  title: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    trim: true,
    required: true
  },
  bannerImage: {
    type: String,
    trim: true,
    required: true
  },
  status: {
    type: String,
    trim: true,
    required: true
  }
});

// Export the model with the correct type
export const Banner = mongoose.model<IBanner>("banner", bannerSchema);
