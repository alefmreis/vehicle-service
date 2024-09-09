import winston from 'winston';

import { validate } from 'class-validator';

import CreateVehicleDTO from '../_dtos/vehicle/CreateVehicleDTO';
import IVehicleRepository from '../../domain/repositories/VehicleRepository';
import Vehicle from '../../domain/entities/Vehicles';

import { InternalServerError, RepositoryError, ServiceError, ValidationError } from '../../utils/Error';

class CreateVehicleUseCase {
  private vehicleRepository: IVehicleRepository;
  private logger: winston.Logger;

  constructor(vehicleRepository: IVehicleRepository, logger: winston.Logger) {
    this.vehicleRepository = vehicleRepository;
    this.logger = logger;
  }

  async execute(vehicleData: CreateVehicleDTO) {
    try {
      this.logger.debug('starting create vehicle');

      const errors = await validate(vehicleData);
      if (errors.length > 0) {
        this.logger.error('Invalid account data', errors);
        throw new ServiceError('Invalid account data', ValidationError);
      }

      this.logger.debug('creating a new vehicle instance');
      const vehicle = Vehicle.createNew(vehicleData.name, vehicleData.brand, vehicleData.model);

      await this.vehicleRepository.create(vehicle);

      this.logger.debug('vehicle persisted successfully');
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw error;
      }

      if (error instanceof ServiceError) {
        throw error;
      }

      this.logger.error('Error at create vehicle', error);
      throw new ServiceError('Error at create vehicle', InternalServerError);
    }
  }
}

export = CreateVehicleUseCase