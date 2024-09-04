import winston from 'winston';

import { Router } from 'express';

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
): Router {

  const accountController = new AccountController(
    createAccountUseCase,
    loginUseCase,
    resetPasswordAccoutUseCase,
    logger
  );

  const router = Router();

  // Private Routes
  router.post('/accounts', authMiddleware.authenticate.bind(authMiddleware), authMiddleware.isAdmin.bind(authMiddleware), accountController.create);
  router.post('/accounts/reset-password', authMiddleware.authenticate.bind(authMiddleware), authMiddleware.isAdmin.bind(authMiddleware), accountController.resetPassword);

  // Public Routes
  router.post('/accounts/login', (req, res) => accountController.login(req, res));

  return router;
}

export default NewAccountRouters;
