import { Router } from 'express';
import {
  register,
  adminLogin,
  logout,
} from '../controllers/auth.controller.js';
import { loginLimiter } from '../middlewares/rate.limit.js';
import { protect } from '../middlewares/auth.middlewares.js';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', register);

/**
 * @route   POST /api/auth/login
 * @desc    Admin login and return JWT (only admin users)
 * @access  Public
 */
router.post('/login', loginLimiter, adminLogin);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and delete JWT
 * @access  Private
 */
router.post('/logout', protect, logout);

export default router;