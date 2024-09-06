/* eslint-disable @typescript-eslint/ban-ts-comment */
import winston from 'winston';

import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';

import CreateVehicleUseCase from '../../usecases/vehicle/CreateVehicleUseCase';
import DeleteVehicleByIdUseCase from '../../usecases/vehicle/DeleteVehicleByIdUseCase';
import GetVehicleByIdUseCase from '../../usecases/vehicle/GetVehicleByIdUseCase';
import UpdateVehicleUseCase from '../../usecases/vehicle/UpdateVehicleUseCase';
import BaseController from './BaseController';
import CreateVehicleDTO from '../dtos/vehicle/CreateVehicleDTO';
import UpdateVehicleDTO from '../dtos/vehicle/UpdateVehicleDTO';
import GetVehiclesUseCase from '../../usecases/vehicle/GetVehiclesUseCase';
import GetVehiclesDTO from '../dtos/vehicle/GetVehiclesDTO';

class VehicleController extends BaseController {
  private createVehicleUseCase: CreateVehicleUseCase;
  private updateVehicleUseCase: UpdateVehicleUseCase;
  private getVehiclesUseCase: GetVehiclesUseCase;
  private getVehicleByIdUseCase: GetVehicleByIdUseCase;
  private deleteVehicleByIdUseCase: DeleteVehicleByIdUseCase;
  private logger: winston.Logger;

  constructor(
    createVehicleUseCase: CreateVehicleUseCase,
    updateVehicleUseCase: UpdateVehicleUseCase,
    getVehiclesUseCase: GetVehiclesUseCase,
    getVehicleByIdUseCase: GetVehicleByIdUseCase,
    deleteVehicleByIdUseCase: DeleteVehicleByIdUseCase, logger: winston.Logger) {
    super();

    this.createVehicleUseCase = createVehicleUseCase;
    this.updateVehicleUseCase = updateVehicleUseCase;
    this.getVehiclesUseCase = getVehiclesUseCase;
    this.getVehicleByIdUseCase = getVehicleByIdUseCase;
    this.deleteVehicleByIdUseCase = deleteVehicleByIdUseCase;
    this.logger = logger;
  }

  async create(req: Request, res: Response) {
    try {
      const vehicle = plainToInstance(CreateVehicleDTO, req.body);
      // @ts-expect-error
      await this.createVehicleUseCase.execute(vehicle);
      this.onCreated(null, res);
    } catch (error) {
      this.logger.error('error', error);
      this.onError(error, res);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vehicle = plainToInstance(UpdateVehicleDTO, req.body);
      // @ts-expect-error
      await this.updateVehicleUseCase.execute(id, vehicle);
      this.onSuccess(null, null, res);
    } catch (error) {
      this.logger.error('error', error);
      this.onError(error, res);
    }
  }

  async getPaged(req: Request, res: Response) {
    try {
      const data = plainToInstance(GetVehiclesDTO, req.query);
      const vehicles = await this.getVehiclesUseCase.execute(data);
      this.onSuccess(vehicles.data, { pagination: vehicles.pagination }, res);
    } catch (error) {
      this.logger.error('error', error);
      this.onError(error, res);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vehicle = await this.getVehicleByIdUseCase.execute(id);
      this.onSuccess(vehicle, null, res);
    } catch (error) {
      this.logger.error('error', error);
      this.onError(error, res);
    }
  }

  async deleteById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.deleteVehicleByIdUseCase.execute(id);
      this.onSuccess(null, null, res);
    } catch (error) {
      this.logger.error('error', error);
      this.onError(error, res);
    }
  }

}

export = VehicleController