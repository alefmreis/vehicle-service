import winston from 'winston';

import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';

import BaseController from './BaseController';
import CreateAccountDTO from '../dtos/account/CreateAccountDTO';
import CreateAccountUseCase from '../../usecases/account/CreateAccountUseCase';
import LoginDTO from '../dtos/account/LoginDTO';
import LoginUseCase from '../../usecases/account/LoginUseCase';
import ResetPasswordAccountDTO from '../dtos/account/ResetPasswordAccountDTO';
import ResetPasswordAccountUseCase from '../../usecases/account/ResetPasswordAccountUseCase';


class AccountController extends BaseController {
  private createAccountUseCase: CreateAccountUseCase;
  private logger: winston.Logger;
  private loginUseCase: LoginUseCase;
  private resetPasswordAccountUseCase: ResetPasswordAccountUseCase;

  constructor(createAccountUseCase: CreateAccountUseCase, loginUseCase: LoginUseCase, resetPasswordAccountUseCase: ResetPasswordAccountUseCase, logger: winston.Logger) {
    super();

    this.createAccountUseCase = createAccountUseCase;
    this.logger = logger;
    this.loginUseCase = loginUseCase;
    this.resetPasswordAccountUseCase = resetPasswordAccountUseCase;
  }

  async create(req: Request, res: Response) {
    try {
      const account = plainToInstance(CreateAccountDTO, req.body);
      await this.createAccountUseCase.execute(account);
      this.onCreated(null, res);
    } catch (error) {
      this.logger.error('error', error);
      this.onError(error, res);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const credentials = plainToInstance(LoginDTO, req.body);
      const token = await this.loginUseCase.execute(credentials);
      this.onSuccess({ data: token }, res);
    } catch (error) {
      this.logger.error(error);
      this.onError(error, res);
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const credentials = plainToInstance(ResetPasswordAccountDTO, req.body);
      await this.resetPasswordAccountUseCase.execute(credentials);
      this.onSuccess(null, res);
    } catch (error) {
      this.logger.error(error);
      this.onError(error, res);
    }
  }

}

export = AccountController