/* eslint-disable @typescript-eslint/ban-ts-comment */
import winston from 'winston';

import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';

import BaseController from './BaseController';
import CreateAccountDTO from '../../usecases/_dtos/account/CreateAccountDTO';
import CreateAccountUseCase from '../../usecases/account/CreateAccountUseCase';
import LoginDTO from '../../usecases/_dtos/account/LoginDTO';
import LoginUseCase from '../../usecases/account/LoginUseCase';
import ResetPasswordAccountDTO from '../../usecases/_dtos/account/ResetPasswordAccountDTO';
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
      // @ts-expect-error
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
      // @ts-expect-error
      const token = await this.loginUseCase.execute(credentials);
      this.onSuccess({ token }, null, res);
    } catch (error) {
      this.logger.error(error);
      this.onError(error, res);
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const credentials = plainToInstance(ResetPasswordAccountDTO, req.body);
      // @ts-expect-error
      await this.resetPasswordAccountUseCase.execute(credentials);
      this.onSuccess(null, null, res);
    } catch (error) {
      this.logger.error(error);
      this.onError(error, res);
    }
  }

}

export = AccountController