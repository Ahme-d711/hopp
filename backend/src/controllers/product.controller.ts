import type { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import ProductModel from '../models/product.model.js';
import { productValidationSchema, updateProductSchema } from '../schemas/product.schemas.js';
import ApiFeatures from '../utils/ApiFeatures.js';
import type { IProduct } from '../types/product.types.js';
import { isValidObjectId } from 'mongoose';
import { uploadToCloudinary } from '../service/imageService.js';
import type { MulterFile } from '../types/express-multer.js';

/**
 * Parse FormData body and convert numeric fields to numbers
 */
const parseFormDataBody = (body: Record<string, unknown>): Record<string, unknown> => {
  const parsed: Record<string, unknown> = { ...body };

  // Convert numeric fields
  if (parsed.price !== undefined && typeof parsed.price === 'string') {
    parsed.price = parseFloat(parsed.price);
  }
  if (parsed.originalPrice !== undefined && typeof parsed.originalPrice === 'string' && parsed.originalPrice !== '') {
    parsed.originalPrice = parseFloat(parsed.originalPrice);
  }
  if (parsed.stock !== undefined && typeof parsed.stock === 'string') {
    parsed.stock = parseInt(parsed.stock, 10);
  }

  // Remove empty originalPrice
  if (parsed.originalPrice === '' || parsed.originalPrice === undefined) {
    delete parsed.originalPrice;
  }

  return parsed;
};

/**
 * @desc    Create a new product
 * @route   POST /api/v1/products
 * @access  Private/Admin (Validation handled in routes)
 */
export const createProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // 1. Parse FormData body (convert string numbers to actual numbers)
  const parsedBody = parseFormDataBody(req.body as Record<string, unknown>);
  
  // 2. Validate input
  const result = productValidationSchema.safeParse(parsedBody);
  if (!result.success) {
    const message = result.error.issues.map((i) => i.message).join(', ');
    return next(AppError.badRequest(message));
  }

  // 3. Handle image upload (required for new products)
  const file = req.file as MulterFile | undefined;
  if (!file) {
    return next(AppError.badRequest('Product image is required'));
  }

  let imageUrl = '';
  try {
    const uploadResult = await uploadToCloudinary(file, {
      folder: 'products',
      tags: ['product'],
    });
    imageUrl = uploadResult.secure_url;
  } catch (error) {
    return next(error);
  }

  // 4. Create product with image URL
  const product = await ProductModel.create({
    ...result.data,
    image: imageUrl,
  });

  res.status(201).json({
    status: 'success',
    data: {
      product,
    },
  });
});

/**
 * @desc    Get all products
 * @route   GET /api/v1/products
 * @access  Public
 */
export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  // Exclude deleted products by default
  const query = ProductModel.find({ isDeleted: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiFeatures = new ApiFeatures<IProduct>(query, req.query as any)
    .filter()
    .search(['name', 'nameEn', 'description', 'descriptionEn'])
    .sort()
    .select()
    .paginate();

  const { results, pagination } = await apiFeatures.execute();

  res.status(200).json({
    status: 'success',
    results: results.length,
    pagination,
    data: {
      products: results,
    },
  });
});

/**
 * @desc    Get single product by ID
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
export const getProductById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(AppError.badRequest('Invalid product ID'));
  }
  if (!id) {
    return next(AppError.badRequest('Product ID is required'));
  }
  const product = await ProductModel.findById(id);

  if (!product) {
    return next(AppError.notFound('Product not found'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});

/**
 * @desc    Update a product
 * @route   PATCH /api/v1/products/:id
 * @access  Private/Admin
 */
export const updateProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(AppError.badRequest('Invalid product ID'));
  }
  if (!id) {
    return next(AppError.badRequest('Product ID is required'));
  }
  // 1. Parse FormData body (convert string numbers to actual numbers)
  const parsedBody = parseFormDataBody(req.body as Record<string, unknown>);
  
  // 2. Validate input
  const result = updateProductSchema.safeParse(parsedBody);
  if (!result.success) {
    const message = result.error.issues.map((i) => i.message).join(', ');
    return next(AppError.badRequest(message));
  }

  // 3. Handle image upload if new file provided
  const file = req.file as MulterFile | undefined;
  const updateData: Partial<IProduct> = { ...result.data };
  
  if (file) {
    try {
      const uploadResult = await uploadToCloudinary(file, {
        folder: 'products',
        tags: ['product'],
      });
      updateData.image = uploadResult.secure_url;
    } catch (error) {
      return next(error);
    }
  }

  // 4. Update product
  const product = await ProductModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(AppError.notFound('Product not found'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});

/**
 * @desc    Delete a product (Soft delete)
 * @route   DELETE /api/v1/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(AppError.badRequest('Invalid product ID'));
  }
  if (!id) {
    return next(AppError.badRequest('Product ID is required'));
  }
  const product = await ProductModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

  if (!product) {
    return next(AppError.notFound('Product not found'));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
