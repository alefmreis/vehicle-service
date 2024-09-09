import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import Account from '../src/domain/entities/Account';
import NewLogger from '../src/infrastructure/Logger';
import NewDynamoDB from '../src/infrastructure/DynamoDBClient';
import DynamoDBAccountRepository from '../src/infrastructure/repositories/DynamoDBAccountRepository';


(async () => {
  const logger = NewLogger('info', 'script');

  try {
    const AWS_DYNAMO_DB_ACCESS_KEY = process.env.AWS_DYNAMO_DB_ACCESS_KEY || '';
    const AWS_DYNAMO_DB_ACCESS_SECRET = process.env.AWS_DYNAMO_DB_ACCESS_SECRET || '';
    const AWS_DYNAMO_DB_ENDPOINT = process.env.AWS_DYNAMO_DB_ENDPOINT || '';
    const AWS_DYNAMO_DB_REGION = process.env.AWS_DYNAMO_DB_REGION || '';

    const DEFAULT_USER_EMAIL = process.env.DEFAULT_USER_EMAIL;
    if (!DEFAULT_USER_EMAIL) {
      throw new Error('Invalid user email');
    }

    const DEFAULT_USER_PASSWORD = process.env.DEFAULT_USER_PASSWORD;
    if (!DEFAULT_USER_PASSWORD) {
      throw new Error('Invalid user password');
    }
    
    const dbClient = NewDynamoDB(
      AWS_DYNAMO_DB_ENDPOINT,
      AWS_DYNAMO_DB_REGION,
      AWS_DYNAMO_DB_ACCESS_KEY,
      AWS_DYNAMO_DB_ACCESS_SECRET
    );

    const accountRepository = new DynamoDBAccountRepository(dbClient, logger);
    const defaultAccount = Account.createNew(DEFAULT_USER_EMAIL, 'Default User', true, DEFAULT_USER_PASSWORD);

    await accountRepository.create(defaultAccount);
  } catch (error) {
    logger.error('Error at insert default account at db', error);
  }
})();