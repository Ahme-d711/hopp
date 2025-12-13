import { loginSchema, userValidationSchema } from '../schemas/userSchemas.js';
import type { ZodIssue } from 'zod';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import type { Request, Response, NextFunction } from 'express';
import { createSendToken } from '../utils/sendToken.js';
import UserModel from '../models/user.model.js';

/**
 * Register a new user
 */
export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // 1. Validate input
  const result = userValidationSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((i: ZodIssue) => i.message).join(', ');
    return next(AppError.badRequest(message));
  }

  // 2. Create user (Mongoose يُطبّق pre-save hash + transform)
  let newUser;
  try {
    newUser = await UserModel.create({
      ...result.data,
    });
  } catch (error: unknown) {
    // 3. Handle duplicate email (E11000)
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      'keyValue' in error &&
      error.code === 11000 &&
      typeof error.keyValue === 'object' &&
      error.keyValue !== null
    ) {
      const field = Object.keys(error.keyValue)[0];
      return next(AppError.badRequest(`This ${field} is already taken`));
    }
    return next(error); // أخطاء أخرى تُمرر لـ globalError
  }

  // 4. Send token + user (بدون password)
  createSendToken(newUser, 201, res);
});

/**
 * Login user
 */
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // 1. Validate input
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map(i => i.message).join(', ');
    return next(AppError.badRequest(message));
  }

  const { email, password } = result.data;

  // 2. Find user with password
  const user = await UserModel.findOne({ email }).select('+password');

  console.log(user);

  console.log(password);
  
  
  if (!user || !(await user.comparePassword(password))) {
    return next(AppError.unauthorized('Incorrect email or password'));
  }

  if (!user.isActive) {
    return next(AppError.unauthorized('Account is not active'));
  }

  // 3. Send token + user
  createSendToken(user, 200, res);
});

/**
 * Admin login - only allows users with admin role
 */
export const adminLogin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // 1. Validate input
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map(i => i.message).join(', ');
    return next(AppError.badRequest(message));
  }

  const { email, password } = result.data;

  // 2. Find user with password
  const user = await UserModel.findOne({ email }).select('+password');
  
  if (!user || !(await user.comparePassword(password))) {
    return next(AppError.unauthorized('Incorrect email or password'));
  }

  if (!user.isActive) {
    return next(AppError.unauthorized('Account is not active'));
  }

  // 3. Check if user is admin
  if (user.role !== 'admin') {
    return next(AppError.forbidden('Access denied. Admin privileges required'));
  }

  // 4. Send token + user
  createSendToken(user, 200, res);
});

/**
 * Get current user (requires authentication)
 */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  // User is already attached by protect middleware
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
});

/**
 * Logout user by clearing JWT cookie
 */
    // @ts-expect-error Too complex union
export const logout = asyncHandler(( req: Request, res: Response) => {
  // 1. مسح الكوكي بأعلى أمان
  res.cookie('edu_token', '', {
    httpOnly: true,
    secure: process.env['NODE_ENV'] === 'production',
    sameSite: 'strict',
    path: '/',
    expires: new Date(0), // فوري
  });

  // 2. رد واضح
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
});


