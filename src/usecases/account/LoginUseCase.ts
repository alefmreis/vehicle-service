import jwt from 'jsonwebtoken';
import winston from 'winston';

import { validate } from 'class-validator';

import IAccountRepository from '../../domain/repositories/AccountRepository';
import LoginDTO from '../../adapters/dtos/account/LoginDTO';

import { InternalServerError, NotFoundError, RepositoryError, ServiceError, UnauthorizedError, ValidationError } from '../../utils/Error';


class LoginUseCase {
  private accountRepository: IAccountRepository;
  private logger: winston.Logger;

  constructor(accountRepository: IAccountRepository, logger: winston.Logger) {
    this.accountRepository = accountRepository;
    this.logger = logger;
  }

  async execute(credentials: LoginDTO) {
    try {
      this.logger.info('starting login to account');

      const errors = await validate(credentials);
      if (errors.length > 0) {
        this.logger.error('Invalid credentials data', errors);
        throw new ServiceError('Invalid credentials data', ValidationError);
      }

      this.logger.debug(`getting ${credentials.email} account at db`);
      const account = await this.accountRepository.getByEmail(credentials.email);
      if (!account) {
        this.logger.error('Account not found');
        throw new ServiceError('Account not found', NotFoundError);
      }

      this.logger.debug('validating credentails');
      if (!account.checkPassword(credentials.password)) {
        this.logger.error('Invalid credentials');
        throw new ServiceError('Invalid credentials', UnauthorizedError);
      }

      const data = jwt.sign({ email: account.email, admin: account.isAdmin }, 'secret', {
        expiresIn: '3h'
      });
      
      this.logger.info('acount logged in successfully');
      return data;
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw error;
      }

      if (error instanceof ServiceError) {
        throw error;
      }

      this.logger.error('Error at account login', error);
      throw new ServiceError('Error at account login', InternalServerError);
    }
  }
}

export = LoginUseCase