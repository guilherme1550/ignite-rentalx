import { CarsRepositoryInMemory } from "@modules/cars/repositories/inMemory/CarsRepositoryInMemory";
import { SpecificationsRepositoryInMemory } from "@modules/cars/repositories/inMemory/SpecificationsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;

describe("Create Car Specification", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationsRepositoryInMemory
    );
  });

  it("should not be able to add a new specification to a non-existing car", () => {
    expect(async () => {
      const car_id = "1234";
      const specifications_id = ["54321"];

      await createCarSpecificationUseCase.execute({
        car_id,
        specifications_id,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to add a new specification to the car", async () => {
    const car1 = await carsRepositoryInMemory.create({
      brand: "Brand",
      category_id: "category",
      daily_rate: 100,
      description: "Description Car",
      fine_amount: 60,
      license_plate: "ABC-1234",
      name: "Name Car",
    });

    const specification1 = await specificationsRepositoryInMemory.create({
      description: "description specification 1",
      name: "specification 1",
    });

    const specification2 = await specificationsRepositoryInMemory.create({
      description: "description specification 2",
      name: "specification 2",
    });

    const specifications_id = [specification1.id, specification2.id];

    const car = await createCarSpecificationUseCase.execute({
      car_id: car1.id,
      specifications_id,
    });

    // --- Expect realizado de maneira diferente do que foi feito na aula ---
    // --- Pois dessa maneira o teste fica melhor implementado, e garante que as specifications foram realmente add ao carro ---
    // --- Aula: Chapter IV - Cap 3 - Finalizando CreateCarSpecificationUseCase ---
    expect(car.specifications.length).toBe(2);
    expect(car).toEqual(
      expect.objectContaining({
        specifications: [
          {
            id: specification1.id,
            description: specification1.description,
            name: specification1.name,
          },
          {
            id: specification2.id,
            description: specification2.description,
            name: specification2.name,
          },
        ],
      })
    );
  });
});
