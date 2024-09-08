import request from 'supertest';

import server from '../../src/app';
import config from '../test.config';

import DynamoDBVehicleRepository from '../../src/adapters/repositories/DynamoDBVehicleRepository';
import NewDynamoDB from '../../src/infrastructure/DynamoDBClient';
import NewLogger from '../../src/infrastructure/Logger';
import Vehicle from '../../src/domain/entities/Vehicles';
import DynamoDBAccountRepository from '../../src/adapters/repositories/DynamoDBAccountRepository';
import Account from '../../src/domain/entities/Account';
import LoginUseCase from '../../src/usecases/account/LoginUseCase';
import LoginDTO from '../../src/adapters/dtos/account/LoginDTO';


describe('/vehicles/:id', () => {
  const logger = NewLogger('warn', 'integration-test');
  const dynamoDBClient = NewDynamoDB(
    config.AWSDynamoDBEndpoint,
    config.AWSDynamoDBRegion,
    config.AWSDynamoDBAccessKey,
    config.AWSDynamoDBAccessSecret
  );

  const accountRepository = new DynamoDBAccountRepository(dynamoDBClient, logger);
  const vehicleRepository = new DynamoDBVehicleRepository(dynamoDBClient, logger);

  const loginUseCase = new LoginUseCase(accountRepository, config.JWTSecretKey, logger);
  const vehicle = Vehicle.createNew('Test Vehicle', 'Brand', 'Model');
  const account = Account.createNew('test@test.com', 'Test Account', true, '12345678');

  let token: string;

  beforeAll(async () => {
    await accountRepository.create(account);
    await vehicleRepository.create(vehicle);

    const credentials = new LoginDTO(account.email, '12345678');

    token = await loginUseCase.execute(credentials);
  });

  afterAll(async () => {
    await vehicleRepository.deleteById(vehicle.id);
    await accountRepository.deleteById(account.id);
  });

  it('should return 200 and the vehicle when found', async () => {
    const response = await request(server)
      .get(`/api/v1/vehicles/${vehicle.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        id: vehicle.id,
        name: vehicle.name,
        brand: vehicle.brand,
        model: vehicle.model
      }
    });
  });

  it('should return 401 if the request token was not provided', async () => {
    const response = await request(server)
      .get('/api/v1/vehicles/999');

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      message: 'Access denied. No token provided.'
    });
  });

  it('should return 401 if the request token was not provided', async () => {
    const response = await request(server)
      .get('/api/v1/vehicles/999');

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      message: 'Access denied. No token provided.'
    });
  });

  it('should return 401 if the jwt token is invalid', async () => {
    const response = await request(server)
      .get('/api/v1/vehicles/999')
      .set('Authorization', 'Bearer asdhqwueh12312');

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      message: 'Access denied. jwt malformed'
    });
  });

  it('should return 404 if the vehicle is not found', async () => {
    const response = await request(server)
      .get('/api/v1/vehicles/999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: {
        message: 'Vehicle not found',
      },
      data: null
    });
  });
});
