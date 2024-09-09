import winston from 'winston';

import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { DeleteItemCommand, DynamoDBClient, PutItemCommand, QueryCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

import IAccountRepository from '../../domain/repositories/AccountRepository';
import Account from '../../domain/entities/Account';

import { RepositoryError } from '../../utils/Error';

class DynamoDBAccountRepository implements IAccountRepository {
  private dbClient: DynamoDBClient;
  private logger: winston.Logger;
  private tableName: string = 'accounts';

  constructor(dbClient: DynamoDBClient, logger: winston.Logger) {
    this.dbClient = dbClient;
    this.logger = logger;
  }

  async getByEmail(email: string): Promise<Account | null> {
    try {
      this.logger.debug(`gettting account ${email} from db`);

      const params = {
        TableName: this.tableName,
        IndexName: 'email_idx',
        KeyConditionExpression: '#email = :email',
        ExpressionAttributeNames: {
          '#id': 'id',
          '#email': 'email',
          '#name': 'name',
          '#isAdmin': 'isAdmin',
          '#password': 'password',
        },
        ExpressionAttributeValues: marshall({ ':email': email }),
        ProjectionExpression: '#id, #email, #name, #isAdmin, #password'
      };

      const command = new QueryCommand(params);
      const result = await this.dbClient.send(command);

      if (!result.Items || result.Items && result.Items?.length == 0) {
        this.logger.debug(`account ${email} not found`);
        return null;
      }

      const accountItem = unmarshall(result.Items[0]);
      const account = Account.createFromDatabase(accountItem.id, accountItem.email, accountItem.name, accountItem.isAdmin, accountItem.password);

      return account;
    } catch (error) {
      this.logger.error('Failed to get account from database', error);
      throw new RepositoryError(`Failed to get account from db: ${email}`);
    }
  }

  async create(account: Account) {
    try {
      this.logger.debug('starting insert account at db');

      const params = {
        TableName: this.tableName,
        Item: marshall(account, { convertClassInstanceToMap: true }),
      };

      const command = new PutItemCommand(params);
      await this.dbClient.send(command);

      this.logger.debug('account iserted successfully');
    } catch (error) {
      this.logger.error('error to insert account', error);
      throw new RepositoryError('Failed to insert account at db');
    }
  }

  async update(account: Account) {
    try {
      this.logger.debug('starting update account at db');

      const params = {
        TableName: this.tableName,
        Key: marshall({ id: account.id }),
        UpdateExpression: 'set #email = :email, #password = :password',
        ExpressionAttributeNames: {
          '#email': 'email',
          '#password': 'password',
        },
        ExpressionAttributeValues: marshall({
          ':email': account.email,
          ':password': account['password'],
        }),
        ReturnValue: 'ALL_NEW',
      };

      const command = new UpdateItemCommand(params);
      await this.dbClient.send(command);

      this.logger.debug('account updated successfully');
    } catch (error) {
      this.logger.error('Failed to update account at db', error);
      throw new RepositoryError('Failed to update account at db');
    }
  }

  async deleteById(id: string) {
    try {
      this.logger.debug(`deleting account: ${id}`);

      const params = {
        TableName: this.tableName,
        Key: marshall({ id })
      };

      const command = new DeleteItemCommand(params);
      await this.dbClient.send(command);

      this.logger.debug(`account ${id} successfully deleted`);
    } catch (error) {
      this.logger.error('Failed to delete account', error);
      throw new RepositoryError(`Failed to delete account: ${id}`);
    }
  }
}

export = DynamoDBAccountRepository