import winston from 'winston';

import { Router, RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';

import AccountController from '../controllers/AccountController';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import CreateAccountUseCase from '../../usecases/account/CreateAccountUseCase';
import LoginUseCase from '../../usecases/account/LoginUseCase';
import ResetPasswordAccountUseCase from '../../usecases/account/ResetPasswordAccountUseCase';


function NewAccountRouters(
  createAccountUseCase: CreateAccountUseCase,
  loginUseCase: LoginUseCase,
  resetPasswordAccoutUseCase: ResetPasswordAccountUseCase,
  logger: winston.Logger,
  authMiddleware: AuthMiddleware,
  authLimiter: RequestHandler
): Router {

  const accountController = new AccountController(
    createAccountUseCase,
    loginUseCase,
    resetPasswordAccoutUseCase,
    logger
  );

  const router = Router();

  // Rate limiter for authenticated admin operations
  const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Allow more requests for authenticated operations
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Private Routes - with rate limiting for defense in depth
  router.post('/accounts', authLimiter, authMiddleware.authenticate.bind(authMiddleware), authMiddleware.isAdmin.bind(authMiddleware), (req, res) => accountController.create(req, res));
  router.post('/accounts/reset-password', adminLimiter, authMiddleware.authenticate.bind(authMiddleware), authMiddleware.isAdmin.bind(authMiddleware), (req, res) => accountController.resetPassword(req, res));

  // Public Routes - with rate limiting
  router.post('/accounts/login', authLimiter, (req, res) => accountController.login(req, res));

  return router;
}

export default NewAccountRouters;
