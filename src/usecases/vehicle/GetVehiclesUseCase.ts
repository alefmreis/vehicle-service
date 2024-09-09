import winston from 'winston';

import CursorPage from '../../utils/Pagination';
import GetVehiclesDTO from '../_dtos/vehicle/GetVehiclesDTO';
import IVehicleRepository from '../../domain/repositories/VehicleRepository';

import { InternalServerError, RepositoryError, ServiceError } from '../../utils/Error';
import Vehicle from '../../domain/entities/Vehicles';



class GetVehiclesUseCase {
  private vehicleRepository: IVehicleRepository;
  private logger: winston.Logger;

  constructor(vehicleRepository: IVehicleRepository, logger: winston.Logger) {
    this.vehicleRepository = vehicleRepository;
    this.logger = logger;
  }

  async execute(params: GetVehiclesDTO): Promise<{ data: Vehicle[], pagination: CursorPage }> {
    try {    
      this.logger.debug('starting get vehicles');

      const limit = (params.limit) ? params.limit : 20;

      const vehicles = await this.vehicleRepository.getPaged(limit, params.pageToken);

      return vehicles;
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

export = GetVehiclesUseCase;