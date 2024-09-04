import Vehicle from '../../src/domain/entities/Vehicles';

describe('should test vehicle class', () => {
  test('should return the correctly brand name', () => {
    const vehicle = new Vehicle('Onix 1.4', 'GM');
    const vehicleBrand = vehicle.getBrand();

    expect(vehicleBrand).toBe('GM');
  });
});