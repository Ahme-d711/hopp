import { z } from 'zod';

export const productValidationSchema = z.object({
  name: z
    .string()
    .min(2, 'Product name is required')
    .max(100, 'Product name cannot exceed 100 characters')
    .trim(),
  nameEn: z
    .string()
    .min(2, 'Product name (English) is required')
    .max(100, 'Product name (English) cannot exceed 100 characters')
    .trim(),
  description: z
    .string()
    .min(10, 'Description is required')
    .trim(),
  descriptionEn: z
    .string()
    .min(10, 'Description (English) is required')
    .trim(),
  price: z
    .number()
    .min(0, 'Price is required'),
  originalPrice: z
    .number()
    .min(0, 'Original price must be a positive number')
    .optional(),
  stock: z
    .number()
    .int('Stock must be an integer')
    .min(0, 'Stock cannot be negative')
    .default(0),
  // Image will come from file upload, not in body
});

export const updateProductSchema = productValidationSchema.partial();
