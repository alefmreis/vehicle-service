import { v4 as uuidV4 } from 'uuid';

class Vehicle {
  public readonly id: string;
  public name: string;
  public brand: string;
  public model: string;

  private constructor(id: string, name: string, brand: string, model: string) {
    this.id = id;
    this.name = name;
    this.brand = brand;
    this.model = model;
  }

  public static createNew(name: string, brand: string, model: string): Vehicle {
    return new Vehicle(uuidV4(), name, brand, model);
  }

  public static createFromDatabase(id: string, name: string, brand: string, model: string): Vehicle {
    return new Vehicle(id, name, brand, model);
  }
}

export = Vehicle
