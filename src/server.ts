import 'reflect-metadata';

import express from 'express';
import bodyParser from 'body-parser';

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


(async () => {
  const app = express();

  const logger = NewLogger('info', 'users-api');
  const db = NewDynamoDB('http://localhost:8000', 'us-west-2', 'local', 'local');

  // middlewares
  const authMiddleware = new AuthMiddleware('secret', logger);

  // repositories
  const accountRepository = new DynamoDBAccountRepository(db, logger);
  const vehicleRepository = new DynamoDBVehicleRepository(db, logger);

  // use cases
  const createAccountUseCase = new CreateAccountUseCase(accountRepository, logger);
  const loginUseCase = new LoginUseCase(accountRepository, logger);
  const resetPasswordAccountUseCase = new ResetPasswordAccountUseCase(accountRepository, logger);
  const createVehicleUseCase = new CreateVehicleUseCase(vehicleRepository, logger);
  const updateVehicleUseCase = new UpdateVehicleUseCase(vehicleRepository, logger);
  const getVehicleByIdUseCase = new GetVehicleByIdUseCase(vehicleRepository, logger);
  const deleteVehicleByIdUseCase = new DeleteVehicleByIdUseCase(vehicleRepository, logger);

  // rotes
  const accountRoutes = NewAccountRouters(createAccountUseCase, loginUseCase, resetPasswordAccountUseCase, logger, authMiddleware);
  const vehicleRoutes = NewVehicleRouters(createVehicleUseCase, updateVehicleUseCase, getVehicleByIdUseCase, deleteVehicleByIdUseCase, logger, authMiddleware);

  const PORT = process.env.PORT || 3000;

  app.use(bodyParser.json());
  app.use('/api/v1', accountRoutes);
  app.use('/api/v1/', vehicleRoutes);

  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
})();
