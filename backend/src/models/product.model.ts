import { model, Schema } from 'mongoose';
import type { IProduct, IProductMethods, IProductModel, TransformableProduct } from '../types/product.types.js';

// === Schema ===
const productSchema = new Schema<IProduct, IProductModel, IProductMethods>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Product name must be at least 2 characters'],
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    nameEn: {
      type: String,
      required: [true, 'Product name (English) is required'],
      trim: true,
      minlength: [2, 'Product name (English) must be at least 2 characters'],
      maxlength: [100, 'Product name (English) cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
    },
    descriptionEn: {
      type: String,
      required: [true, 'Description (English) is required'],
      trim: true,
      minlength: [10, 'Description (English) must be at least 10 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price must be a positive number'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform: transformFn },
    toObject: { virtuals: true },
  }
);

// === Virtuals ===
productSchema.virtual('isDiscounted').get(function () {
  return !!(this.originalPrice && this.originalPrice > this.price);
});

// === Transform ===
function transformFn(_doc: unknown, ret: TransformableProduct): TransformableProduct {
  delete ret.__v;
  delete ret.isDeleted;
  return ret;
}

// === Middleware: Soft Delete ===
productSchema.pre(/^find/, function (next) {
  // @ts-expect-error - Mongoose Query types are complex to type correctly here without more boilerplate
  if (this._conditions.isDeleted === undefined) {
    // @ts-expect-error - Mongoose Query types are complex
    this.find({ isDeleted: { $ne: true } });
  }
  next();
});

// === Model ===
const ProductModel = model<IProduct, IProductModel>('Product', productSchema);

export default ProductModel;
