import winston from 'winston';

import GetVehicleByIdUseCase from '../../../../src/usecases/vehicle/GetVehicleByIdUseCase';
import IVehicleRepository from '../../../../src/domain/repositories/VehicleRepository';
import Vehicle from '../../../../src/domain/entities/Vehicles';

import { InternalServerError, NotFoundError, RepositoryError, ServiceError } from '../../../../src/utils/Error';


describe('GetVehicleByIdUseCase', () => {
  let vehicleRepository: jest.Mocked<IVehicleRepository>;
  let logger: jest.Mocked<winston.Logger>;
  let useCase: GetVehicleByIdUseCase;

  const mockVehicle = Vehicle.createNew('Test Vehicle', 'Brand', 'Model');

  beforeEach(() => {
    vehicleRepository = { getById: jest.fn() } as unknown as jest.Mocked<IVehicleRepository>;
    logger = { debug: jest.fn(), error: jest.fn(), } as unknown as jest.Mocked<winston.Logger>;
    useCase = new GetVehicleByIdUseCase(vehicleRepository, logger);
  });

  it('should return the vehicle when found', async () => {
    vehicleRepository.getById.mockResolvedValue(mockVehicle);

    const result = await useCase.execute('1');

    expect(result).toBe(mockVehicle);
    expect(vehicleRepository.getById).toHaveBeenCalledWith('1');
    expect(logger.debug).toHaveBeenCalledWith('starting get vehicle 1');
  });

  it('should throw a NotFoundError when vehicle is not found', async () => {
    vehicleRepository.getById.mockResolvedValue(null);

    await expect(useCase.execute('1')).rejects.toThrow(new ServiceError('Vehicle not found', NotFoundError));
    expect(vehicleRepository.getById).toHaveBeenCalledWith('1');
    expect(logger.error).toHaveBeenCalledWith('Vehicle not found');
  });

  it('should throw a RepositoryError if the repository throws it', async () => {
    const repoError = new RepositoryError('Repository error');
    vehicleRepository.getById.mockRejectedValue(repoError);

    await expect(useCase.execute('1')).rejects.toThrow(repoError);
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should throw a ServiceError if caught', async () => {
    const serviceError = new ServiceError('Service error', NotFoundError);
    vehicleRepository.getById.mockRejectedValue(serviceError);

    await expect(useCase.execute('1')).rejects.toThrow(serviceError);
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should throw a InternalServerError for unhandled errors', async () => {
    const genericError = new Error('Generic error');
    vehicleRepository.getById.mockRejectedValue(genericError);

    await expect(useCase.execute('1')).rejects.toThrow(new ServiceError('Error at get vehicle', InternalServerError));
    expect(logger.error).toHaveBeenCalledWith('Error at get vehicle', genericError);
  });
});
