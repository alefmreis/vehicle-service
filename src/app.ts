import 'reflect-metadata';

import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import config from './config/server.config';
import NewLogger from './infrastructure/Logger';
import NewDynamoDB from './infrastructure/DynamoDBClient';
import DynamoDBAccountRepository from './infrastructure/repositories/DynamoDBAccountRepository';
import CreateAccountUseCase from './usecases/account/CreateAccountUseCase';
import LoginUseCase from './usecases/account/LoginUseCase';
import ResetPasswordAccountUseCase from './usecases/account/ResetPasswordAccountUseCase';
import NewAccountRouters from './http/routes/AccountRoutes';
import AuthMiddleware from './http/middlewares/AuthMiddleware';
import NewVehicleRouters from './http/routes/VehicleRoutes';
import DynamoDBVehicleRepository from './infrastructure/repositories/DynamoDBVehicleRepository';
import CreateVehicleUseCase from './usecases/vehicle/CreateVehicleUseCase';
import UpdateVehicleUseCase from './usecases/vehicle/UpdateVehicleUseCase';
import GetVehicleByIdUseCase from './usecases/vehicle/GetVehicleByIdUseCase';
import DeleteVehicleByIdUseCase from './usecases/vehicle/DeleteVehicleByIdUseCase';
import GetVehiclesUseCase from './usecases/vehicle/GetVehiclesUseCase';

const app = express();

const logger = NewLogger(config.LogLevel, 'vehicle-service-api');
const db = NewDynamoDB(config.AWSDynamoDBEndpoint, config.AWSDynamoDBRegion, config.AWSDynamoDBAccessKey, config.AWSDynamoDBAccessSecret);

// Security middlewares
app.use(helmet()); // Add security headers
app.use(cors()); // Enable CORS with default settings

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// middlewares
const authMiddleware = new AuthMiddleware(config.JWTSecretKey, logger);

// repositories
const accountRepository = new DynamoDBAccountRepository(db, logger);
const vehicleRepository = new DynamoDBVehicleRepository(db, logger);

// use cases
const createAccountUseCase = new CreateAccountUseCase(accountRepository, logger);
const loginUseCase = new LoginUseCase(accountRepository, config.JWTSecretKey, logger);
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
  authMiddleware,
  authLimiter
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

export default app;
