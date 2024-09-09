import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

class UpdateVehicleDTO {
  @Expose({ name: 'name' })
  @IsNotEmpty()
  public name: string;

  @Expose({ name: 'brand' })
  @IsNotEmpty()
  public brand: string;

  @Expose({ name: 'model' })
  @IsNotEmpty()
  public model: string;

  constructor(name: string, brand: string, model: string) {
    this.name = name;
    this.brand = brand;
    this.model = model;
  }
}

export = UpdateVehicleDTO