import winston from 'winston';

import { validate } from 'class-validator';

import Account from '../../domain/entities/Account';
import CreateAccountDTO from '../_dtos/account/CreateAccountDTO';
import IAccountRepository from '../../domain/repositories/AccountRepository';

import { ConflictError, InternalServerError, RepositoryError, ServiceError, ValidationError } from '../../utils/Error';


class CreateAccountUseCase {
  private accountRepository: IAccountRepository;
  private logger: winston.Logger;

  constructor(accountRepository: IAccountRepository, logger: winston.Logger) {
    this.accountRepository = accountRepository;
    this.logger = logger;
  }

  async execute(accountData: CreateAccountDTO) {
    try {
      this.logger.debug('starting create account');

      const errors = await validate(accountData);
      if (errors.length > 0) {
        this.logger.error('Invalid account data', errors);
        throw new ServiceError('Invalid account data', ValidationError);
      }

      this.logger.debug(`checking if email ${accountData.email} already exists at db`);
      const existentAccount = await this.accountRepository.getByEmail(accountData.email);
      if (existentAccount) {
        this.logger.error('Account already created', { email: accountData.email });
        throw new ServiceError('Account already created', ConflictError);
      }

      this.logger.debug('creating a new account instance');
      const account = Account.createNew(accountData.email, accountData.name, accountData.isAdmin, accountData.password);

      await this.accountRepository.create(account);

      this.logger.debug('account persisted successfully');
    } catch (error) {      
      if (error instanceof RepositoryError) {
        throw error;
      }
      
      if (error instanceof ServiceError) {
        throw error;
      }

      this.logger.error('Error at create account', error);
      throw new ServiceError('Error at create account', InternalServerError);
    }
  }
}

export = CreateAccountUseCase