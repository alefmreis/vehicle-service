import winston from 'winston';

import { validate } from 'class-validator';

import IVehicleRepository from '../../domain/repositories/VehicleRepository';
import UpdateVehicleDTO from '../_dtos/vehicle/UpdateVehicleDTO';

import { InternalServerError, NotFoundError, RepositoryError, ServiceError, ValidationError } from '../../utils/Error';

class UpdateVehicleUseCase {
  private vehicleRepository: IVehicleRepository;
  private logger: winston.Logger;

  constructor(vehicleRepository: IVehicleRepository, logger: winston.Logger) {
    this.vehicleRepository = vehicleRepository;
    this.logger = logger;
  }

  async execute(id: string, vehicleData: UpdateVehicleDTO) {
    try {
      this.logger.info(`starting udpate vehicle ${id}`);

      const errors = await validate(vehicleData);
      if (errors.length > 0) {
        this.logger.error('Invalid vehicle data', errors);
        throw new ServiceError('Invalid credenvehicletials data', ValidationError);
      }

      this.logger.debug(`getting ${id} vehicle at db`);
      const vehicle = await this.vehicleRepository.getById(id);
      if (!vehicle) {
        this.logger.error('Vehicle not found');
        throw new ServiceError('Vehicle not found', NotFoundError);
      }

      vehicle.name = vehicleData.name;
      vehicle.brand = vehicleData.brand;
      vehicle.model = vehicleData.model;

            
      this.logger.debug('updating vehicle at db');
      this.vehicleRepository.update(vehicle);
      
      this.logger.info('vehicle updated succesfully');
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw error;
      }

      if (error instanceof ServiceError) {
        throw error;
      }

      this.logger.error('Error at update vehicle', error);
      throw new ServiceError('Error at update vehicle', InternalServerError);
    }
  }
}

export = UpdateVehicleUseCase