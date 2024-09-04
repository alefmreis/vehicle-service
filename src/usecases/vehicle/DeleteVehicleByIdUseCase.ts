import winston from 'winston';

import IVehicleRepository from '../../domain/repositories/VehicleRepository';

import { InternalServerError, NotFoundError, RepositoryError, ServiceError } from '../../utils/Error';

class DeleteVehicleByIdUseCase {
  private vehicleRepository: IVehicleRepository;
  private logger: winston.Logger;

  constructor(vehicleRepository: IVehicleRepository, logger: winston.Logger) {
    this.vehicleRepository = vehicleRepository;
    this.logger = logger;
  }

  async execute(id: string) {
    try {
      this.logger.info(`starting delete vehicle ${id}`);

      this.logger.debug(`getting ${id} vehicle at db`);
      const vehicle = await this.vehicleRepository.getById(id);
      if (!vehicle) {
        this.logger.error('Vehicle not found');
        throw new ServiceError('Vehicle not found', NotFoundError);
      }

      await this.vehicleRepository.deleteById(id);
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw error;
      }

      if (error instanceof ServiceError) {
        throw error;
      }

      this.logger.error('Error at delete vehicle', error);
      throw new ServiceError('Error at delete vehicle', InternalServerError);
    }
  }
}

export = DeleteVehicleByIdUseCase