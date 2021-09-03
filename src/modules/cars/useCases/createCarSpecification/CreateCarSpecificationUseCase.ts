import { inject } from "tsyringe";

import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { Specification } from "@modules/cars/infra/typeorm/entities/Specification";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { ISpecificationsRepository } from "@modules/cars/repositories/ISpecificationsRepository";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  car_id: string;
  specifications_id: string[];
}

class CreateCarSpecificationUseCase {
  constructor(
    // @inject("CarsRepository")
    private carsRepository: ICarsRepository,
    private specificationsRepository: ISpecificationsRepository
  ) {}

  async execute({ car_id, specifications_id }: IRequest): Promise<Car> {
    const carExists = await this.carsRepository.findById(car_id);

    if (!carExists) {
      throw new AppError("Car does not exists!");
    }

    const specificationsPromise = specifications_id.map(async (id) => {
      const specification = await this.specificationsRepository.findById(id);
      return specification;
    });

    let specifications: Specification[] = [];

    await Promise.all(specificationsPromise).then((specificationsPromise) => {
      specifications = specificationsPromise;
    });

    const car = await this.carsRepository.createSpecification(
      carExists,
      specifications
    );

    return car;
  }
}

export { CreateCarSpecificationUseCase };
