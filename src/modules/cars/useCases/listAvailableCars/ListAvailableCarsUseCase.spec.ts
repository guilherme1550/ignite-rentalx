import { CarsRepositoryInMemory } from "@modules/cars/repositories/inMemory/CarsRepositoryInMemory";

import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

// --- Os testes abaixo foram alterados em relação ao que foi feito no curso ---
// --- Pois, no curso, foi feito de uma maneira que dava para ser melhorado ---
// --- Aula: Chapter IV, Cap 3, Continuação da listagem de carros disponíveis
describe("List Cars", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory
    );
  });

  it("should be able to list all available cars", async () => {
    const car = await carsRepositoryInMemory.create({
      brand: "Brand 1",
      category_id: "category_id",
      daily_rate: 100,
      description: "Description Car",
      fine_amount: 60,
      license_plate: "ABC-4321",
      name: "Car 1",
    });

    const car2 = await carsRepositoryInMemory.create({
      brand: "Brand 2",
      category_id: "category_id",
      daily_rate: 100,
      description: "Description Car 2",
      fine_amount: 60,
      license_plate: "ABC-1234",
      name: "Car 2",
    });

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual(expect.arrayContaining([car]));
    expect(cars).toEqual(expect.arrayContaining([car2]));
    expect(cars).toEqual(
      expect.not.arrayContaining([
        expect.objectContaining({ available: false }),
      ])
    );
  });

  it("should be able to list all available cars by brand", async () => {
    const car1 = await carsRepositoryInMemory.create({
      brand: "Brand 1",
      category_id: "category_id",
      daily_rate: 100,
      description: "Description Car 1",
      fine_amount: 60,
      license_plate: "ABC-1234",
      name: "Car 1",
    });

    const car2 = await carsRepositoryInMemory.create({
      brand: "Brand 2",
      category_id: "category_id",
      daily_rate: 100,
      description: "Description Car 2",
      fine_amount: 60,
      license_plate: "ABC-4321",
      name: "Car 2",
    });

    const cars = await listAvailableCarsUseCase.execute({ brand: "Brand 2" });

    expect(cars).toEqual(expect.arrayContaining([car2]));
    expect(cars).not.toEqual(expect.arrayContaining([car1]));
    expect(cars).toEqual(
      expect.not.arrayContaining([
        expect.objectContaining({ available: false }),
      ])
    );
  });

  it("should be able to list all available cars by category", async () => {
    const car1 = await carsRepositoryInMemory.create({
      brand: "Brand 1",
      category_id: "category_id",
      daily_rate: 100,
      description: "Description Car 1",
      fine_amount: 60,
      license_plate: "ABC-1234",
      name: "Car 1",
    });

    const car2 = await carsRepositoryInMemory.create({
      brand: "Brand 2",
      category_id: "category_id",
      daily_rate: 100,
      description: "Description Car 2",
      fine_amount: 60,
      license_plate: "ABC-4321",
      name: "Car 2",
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: "category_id",
    });

    expect(cars).toEqual(expect.arrayContaining([car1]));
    expect(cars).toEqual(expect.arrayContaining([car2]));
    expect(cars).toEqual(
      expect.not.arrayContaining([
        expect.objectContaining({ available: false }),
      ])
    );
  });

  it("should be able to list all available cars by name", async () => {
    const car1 = await carsRepositoryInMemory.create({
      brand: "Brand 1",
      category_id: "category_id",
      daily_rate: 100,
      description: "Description Car 1",
      fine_amount: 60,
      license_plate: "ABC-1234",
      name: "Car 1",
    });

    const car2 = await carsRepositoryInMemory.create({
      brand: "Brand 2",
      category_id: "category_id",
      daily_rate: 100,
      description: "Description Car 2",
      fine_amount: 60,
      license_plate: "ABC-4321",
      name: "Car 2",
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: "Car 1",
    });

    expect(cars).toEqual(expect.arrayContaining([car1]));
    expect(cars).not.toEqual(expect.arrayContaining([car2]));
    expect(cars).toEqual(
      expect.not.arrayContaining([
        expect.objectContaining({ available: false }),
      ])
    );
  });

  it("should be able to list all available cars by name and brand", async () => {
    const car1 = await carsRepositoryInMemory.create({
      brand: "Brand 1",
      category_id: "category_id",
      daily_rate: 100,
      description: "Description Car 1",
      fine_amount: 60,
      license_plate: "ABC-1234",
      name: "Car 1",
    });

    const car2 = await carsRepositoryInMemory.create({
      brand: "Brand 1",
      category_id: "category_id",
      daily_rate: 100,
      description: "Description Car 2",
      fine_amount: 60,
      license_plate: "ABC-4321",
      name: "Car 1",
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: "Car 1",
      brand: "Brand 1",
    });

    expect(cars).toEqual(expect.arrayContaining([car1]));
    expect(cars).toEqual(expect.arrayContaining([car2]));
    expect(cars).toEqual(
      expect.not.arrayContaining([
        expect.objectContaining({ available: false }),
      ])
    );
  });
});
