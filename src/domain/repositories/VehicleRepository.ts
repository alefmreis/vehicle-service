import Vehicle from '../entities/Vehicles';

interface IVehicleRepository {
  getById(id: string): Promise<Vehicle | null>
  create(vehicle: Vehicle): Promise<void>
  update(vehicle: Vehicle): Promise<void>
  deleteById(id: string): Promise<void>
}

export = IVehicleRepository