import config from '../../../test.config';

import DynamoDBVehicleRepository from '../../../../src/adapters/repositories/DynamoDBVehicleRepository';
import GetVehicleByIdUseCase from '../../../../src/usecases/vehicle/GetVehicleByIdUseCase';
import NewDynamoDB from '../../../../src/infrastructure/DynamoDBClient';
import NewLogger from '../../../../src/infrastructure/Logger';
import Vehicle from '../../../../src/domain/entities/Vehicles';

import { ServiceError, NotFoundError } from '../../../../src/utils/Error';

describe('GetVehicleByIdUseCase Integration Test', () => {
  console.log('CONFIG', config)
  const dynamoDBClient = NewDynamoDB(config.AWSDynamoDBEndpoint, config.AWSDynamoDBRegion, config.AWSDynamoDBAccessKey, config.AWSDynamoDBAccessSecret);
  const logger = NewLogger('warn', 'integration-test');
  const vehicleRepository = new DynamoDBVehicleRepository(dynamoDBClient, logger);
  const useCase = new GetVehicleByIdUseCase(vehicleRepository, logger);

  const vehicle = Vehicle.createNew('Test Vehicle', 'Brand', 'Model');

  beforeAll(async () => {
    await vehicleRepository.create(vehicle);
  });

  afterAll(async () => {
    await vehicleRepository.deleteById(vehicle.id);
  });

  it('should return a vehicle when found in the repository', async () => {
    const result = await useCase.execute(vehicle.id);

    expect(result).toStrictEqual(vehicle);
  });

  it('should throw ServiceError with NotFoundError when vehicle is not found', async () => {
    await expect(useCase.execute('2')).rejects.toThrow(new ServiceError('Vehicle not found', NotFoundError));
  });

  it('should log error when vehicle is not found', async () => {
    const spy = jest.spyOn(logger, 'error');

    await expect(useCase.execute('2')).rejects.toThrow(ServiceError);

    expect(spy).toHaveBeenCalledWith('Vehicle not found');
  });
});
