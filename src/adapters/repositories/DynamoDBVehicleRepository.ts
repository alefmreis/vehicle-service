import winston from 'winston';

import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { DeleteItemCommand, DynamoDBClient, GetItemCommand, PutItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

import IVehicleRepository from '../../domain/repositories/VehicleRepository';
import Vehicle from '../../domain/entities/Vehicles';

import { RepositoryError } from '../../utils/Error';

class DynamoDBVehicleRepository implements IVehicleRepository {
  private dbClient: DynamoDBClient;
  private logger: winston.Logger;
  private tableName: string = 'vehicles';

  constructor(dbClient: DynamoDBClient, logger: winston.Logger) {
    this.dbClient = dbClient;
    this.logger = logger;
  }

  async getById(id: string): Promise<Vehicle | null> {
    try {
      this.logger.debug(`gettting vehicle ${id} from db`);

      const params = {
        TableName: this.tableName,
        Key: marshall({ id })
      };

      const command = new GetItemCommand(params);
      const result = await this.dbClient.send(command);

      if (!result.Item) {
        this.logger.debug(`vehicle ${id} not found`);
        return null;
      }

      const vehicleItem = unmarshall(result.Item);
      const vehicle = Vehicle.createFromDatabase(vehicleItem.id, vehicleItem.name, vehicleItem.brand, vehicleItem.model);

      return vehicle;
    } catch (error) {
      this.logger.error('Failed to get vehicle from database', error);
      throw new RepositoryError(`Failed to get vehicle from db: ${id}`);
    }
  }

  async create(vehicle: Vehicle): Promise<void> {
    try {
      this.logger.debug('starting insert vehicle at db');

      const params = {
        TableName: this.tableName,
        Item: marshall(vehicle, { convertClassInstanceToMap: true }),
      };

      const command = new PutItemCommand(params);
      await this.dbClient.send(command);

      this.logger.debug('vehicle iserted successfully');
    } catch (error) {
      this.logger.error('error to insert vehicle', error);
      throw new RepositoryError('Failed to insert vehicle at db');
    }
  }

  async update(vehicle: Vehicle): Promise<void> {
    try {
      this.logger.debug('starting update vehicle at db');

      const params = {
        TableName: this.tableName,
        Key: marshall({ id: vehicle.id }),
        UpdateExpression: 'set #name = :name, #brand = :brand, #model = :model',
        ExpressionAttributeNames: {
          '#name': 'name',
          '#brand': 'brand',
          '#model': 'model'          
        },
        ExpressionAttributeValues: marshall({
          ':name': vehicle.name,
          ':brand': vehicle.brand,
          ':model': vehicle.model,
        }),
        ReturnValue: 'ALL_NEW',
      };

      const command = new UpdateItemCommand(params);
      await this.dbClient.send(command);

      this.logger.debug('vehicle updated successfully');
    } catch (error) {
      this.logger.error('Failed to update vehicle at db', error);
      throw new RepositoryError('Failed to update vehicle at db');
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      this.logger.debug(`deleting vehicle: ${id}`);
  
      const params = {
        TableName: this.tableName,
        Key: marshall({ id })
      };  
    
      const command = new DeleteItemCommand(params);
      await this.dbClient.send(command);
  
      this.logger.debug(`account ${id} successfully deleted`);
    } catch (error) {
      this.logger.error('Failed to delete vehicle', error);
      throw new RepositoryError(`Failed to delete vehicle: ${id}`);
    }
  }
}

export = DynamoDBVehicleRepository