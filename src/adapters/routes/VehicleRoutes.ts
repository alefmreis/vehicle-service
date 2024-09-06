import winston from 'winston';

import { Router } from 'express';

import AuthMiddleware from '../middlewares/AuthMiddleware';
import VehicleController from '../controllers/VehicleController';
import CreateVehicleUseCase from '../../usecases/vehicle/CreateVehicleUseCase';
import UpdateVehicleUseCase from '../../usecases/vehicle/UpdateVehicleUseCase';
import GetVehicleByIdUseCase from '../../usecases/vehicle/GetVehicleByIdUseCase';
import DeleteVehicleByIdUseCase from '../../usecases/vehicle/DeleteVehicleByIdUseCase';
import GetVehiclesUseCase from '../../usecases/vehicle/GetVehiclesUseCase';


function NewVehicleRouters(
  createVehicleUseCase: CreateVehicleUseCase,
  updateVehicleUseCase: UpdateVehicleUseCase,
  getVehiclesUseCase: GetVehiclesUseCase,
  getByIdUseCase: GetVehicleByIdUseCase,
  deleteByIdUseCase: DeleteVehicleByIdUseCase,
  logger: winston.Logger,
  authMiddleware: AuthMiddleware,
): Router {

  const vehicleController = new VehicleController(
    createVehicleUseCase,
    updateVehicleUseCase,
    getVehiclesUseCase,
    getByIdUseCase,
    deleteByIdUseCase,
    logger
  );

  const router = Router();

  // Private Routes
  router.post('/vehicles',
    authMiddleware.authenticate.bind(authMiddleware),
    authMiddleware.isAdmin.bind(authMiddleware),
    (req, res) => vehicleController.create(req, res));

  router.put('/vehicles/:id',
    authMiddleware.authenticate.bind(authMiddleware),
    authMiddleware.isAdmin.bind(authMiddleware),
    (req, res) => vehicleController.update(req, res));

  router.delete('/vehicles/:id',
    authMiddleware.authenticate.bind(authMiddleware),
    authMiddleware.isAdmin.bind(authMiddleware),
    (req, res) => vehicleController.deleteById(req, res));

  router.get('/vehicles',
    authMiddleware.authenticate.bind(authMiddleware),
    (req, res) => vehicleController.getPaged(req, res));

  router.get('/vehicles/:id',
    authMiddleware.authenticate.bind(authMiddleware),
    (req, res) => vehicleController.getById(req, res));

  return router;
}

export default NewVehicleRouters;
