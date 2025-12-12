import { Router } from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';
import { protect } from '../middlewares/auth.middlewares.js';
import { restrictTo } from '../middlewares/auth.middlewares.js';
import { uploadSingle, uploadSingleOptional } from '../middlewares/upload.image.js';

const router = Router();

/**
 * @route   GET /api/v1/products
 * @desc    Get all products
 * @access  Public
 */
router.get('/', getAllProducts);

/**
 * @route   GET /api/v1/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
router.get('/:id', getProductById);

/**
 * @route   POST /api/v1/products
 * @desc    Create a new product
 * @access  Private/Admin
 */
router.post('/', protect, restrictTo('admin'), uploadSingle('image'), createProduct);

/**
 * @route   PATCH /api/v1/products/:id
 * @desc    Update a product
 * @access  Private/Admin
 */
router.patch('/:id', protect, restrictTo('admin'), uploadSingleOptional('image'), updateProduct);

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Delete a product (Soft delete)
 * @access  Private/Admin
 */
router.delete('/:id', protect, restrictTo('admin'), deleteProduct);

export default router;

