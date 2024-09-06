import CursorPage  from '../../utils/Pagination';
import Vehicle from '../entities/Vehicles';

interface IVehicleRepository {
  getPaged(pageLimit: number, pageToken?: string): Promise<{data: Vehicle[], pagination: CursorPage}>
  getById(id: string): Promise<Vehicle | null>
  create(vehicle: Vehicle): Promise<void>
  update(vehicle: Vehicle): Promise<void>
  deleteById(id: string): Promise<void>
}

export = IVehicleRepository