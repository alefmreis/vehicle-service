import winston from 'winston';

import { validate } from 'class-validator';

import IAccountRepository from '../../domain/repositories/AccountRepository';
import ResetPasswordAccountDTO from '../../adapters/dtos/account/ResetPasswordAccountDTO';

import { InternalServerError, NotFoundError, RepositoryError, ServiceError, ValidationError } from '../../utils/Error';


class ResetPasswordAccountUseCase {
  private accountRepository: IAccountRepository;
  private logger: winston.Logger;

  constructor(accountRepository: IAccountRepository, logger: winston.Logger) {
    this.accountRepository = accountRepository;
    this.logger = logger;
  }

  async execute(credentials: ResetPasswordAccountDTO) {
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

      this.logger.debug('reseting account password');
      account.resetPassword(credentials.newPassword);      

      this.logger.debug('updating account at db');
      this.accountRepository.update(account);
      
      this.logger.info('account updated succesfully');
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw error;
      }

      if (error instanceof ServiceError) {
        throw error;
      }

      this.logger.error('Error at reset accout password', error);
      throw new ServiceError('Error at reset accout password', InternalServerError);
    }
  }
}

export = ResetPasswordAccountUseCase