import winston from 'winston';

import IVehicleRepository from '../../domain/repositories/VehicleRepository';
import Vehicle from '../../domain/entities/Vehicles';

import { InternalServerError, NotFoundError, RepositoryError, ServiceError } from '../../utils/Error';


class GetVehicleByIdUseCase {
  private vehicleRepository: IVehicleRepository;
  private logger: winston.Logger;

  constructor(vehicleRepository: IVehicleRepository, logger: winston.Logger) {
    this.vehicleRepository = vehicleRepository;
    this.logger = logger;
  }

  async execute(id: string): Promise<Vehicle | null> {    
    try {
      this.logger.debug(`starting get vehicle ${id}`);
      
      const vehicle = await this.vehicleRepository.getById(id);
      if (!vehicle) {
        this.logger.error('Vehicle not found');
        throw new ServiceError('Vehicle not found', NotFoundError);
      }

      return vehicle;      
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw error;
      }

      if (error instanceof ServiceError) {
        throw error;
      }

      this.logger.error('Error at get vehicle', error);
      throw new ServiceError('Error at get vehicle', InternalServerError);
    }
  }
}

export = GetVehicleByIdUseCase