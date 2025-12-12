import type { Document, Model } from "mongoose";
import type mongoose from "mongoose";

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  originalPrice?: number;
  stock: number;
  image: string;
  rating: number;
  numReviews: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type TransformableProduct = Partial<IProduct> & {
  __v?: number;
};

// Interfaces for instance methods if strictly needed
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IProductMethods {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type IProductModel = Model<IProduct, {}, IProductMethods>;
