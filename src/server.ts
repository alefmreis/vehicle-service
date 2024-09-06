import 'reflect-metadata';

import express from 'express';
import bodyParser from 'body-parser';

import config from './config/server.config';
import NewLogger from './infrastructure/Logger';
import NewDynamoDB from './infrastructure/DynamoDBClient';
import DynamoDBAccountRepository from './adapters/repositories/DynamoDBAccountRepository';
import CreateAccountUseCase from './usecases/account/CreateAccountUseCase';
import LoginUseCase from './usecases/account/LoginUseCase';
import ResetPasswordAccountUseCase from './usecases/account/ResetPasswordAccountUseCase';
import NewAccountRouters from './adapters/routes/AccountRoutes';
import AuthMiddleware from './adapters/middlewares/AuthMiddleware';
import NewVehicleRouters from './adapters/routes/VehicleRoutes';
import DynamoDBVehicleRepository from './adapters/repositories/DynamoDBVehicleRepository';
import CreateVehicleUseCase from './usecases/vehicle/CreateVehicleUseCase';
import UpdateVehicleUseCase from './usecases/vehicle/UpdateVehicleUseCase';
import GetVehicleByIdUseCase from './usecases/vehicle/GetVehicleByIdUseCase';
import DeleteVehicleByIdUseCase from './usecases/vehicle/DeleteVehicleByIdUseCase';
import GetVehiclesUseCase from './usecases/vehicle/GetVehiclesUseCase';


const app = express();

const logger = NewLogger(config.LogLevel, 'vehicle-service-api');
const db = NewDynamoDB(config.AWSDynamoDBEndpoint, config.AWSDynamoDBRegion, config.AWSDynamoDBAccessKey, config.AWSDynamoDBAccessSecret);

// middlewares
const authMiddleware = new AuthMiddleware(config.JWTSecretKey, logger);

// repositories
const accountRepository = new DynamoDBAccountRepository(db, logger);
const vehicleRepository = new DynamoDBVehicleRepository(db, logger);

// use cases
const createAccountUseCase = new CreateAccountUseCase(accountRepository, logger);
const loginUseCase = new LoginUseCase(accountRepository, config.JWTSecretKey,logger);
const resetPasswordAccountUseCase = new ResetPasswordAccountUseCase(accountRepository, logger);
const createVehicleUseCase = new CreateVehicleUseCase(vehicleRepository, logger);
const updateVehicleUseCase = new UpdateVehicleUseCase(vehicleRepository, logger);
const getVehiclesUseCase = new GetVehiclesUseCase(vehicleRepository, logger);
const getVehicleByIdUseCase = new GetVehicleByIdUseCase(vehicleRepository, logger);
const deleteVehicleByIdUseCase = new DeleteVehicleByIdUseCase(vehicleRepository, logger);

// rotes
const accountRoutes = NewAccountRouters(
  createAccountUseCase,
  loginUseCase,
  resetPasswordAccountUseCase,
  logger,
  authMiddleware
);

const vehicleRoutes = NewVehicleRouters(
  createVehicleUseCase,
  updateVehicleUseCase,
  getVehiclesUseCase,
  getVehicleByIdUseCase,
  deleteVehicleByIdUseCase,
  logger,
  authMiddleware
);


app.use(bodyParser.json());
app.use('/api/v1', accountRoutes);
app.use('/api/v1/', vehicleRoutes);

if (!config.RunInServerlessEnvironment) {
  app.listen(config.Port, () => {
    logger.info(`Server is running on port ${config.Port}`);
  });
}

export default app;
