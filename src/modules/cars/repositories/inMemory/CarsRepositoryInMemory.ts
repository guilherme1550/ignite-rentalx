import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { Specification } from "@modules/cars/infra/typeorm/entities/Specification";

import { ICarsRepository } from "../ICarsRepository";

class CarsRepositoryInMemory implements ICarsRepository {
  cars: Car[] = [];

  async create({
    name,
    license_plate,
    fine_amount,
    description,
    daily_rate,
    category_id,
    brand,
  }: ICreateCarDTO): Promise<Car> {
    const car = new Car();

    Object.assign(car, {
      name,
      license_plate,
      fine_amount,
      description,
      daily_rate,
      category_id,
      brand,
    });

    this.cars.push(car);

    return car;
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    return this.cars.find((car) => car.license_plate === license_plate);
  }

  async findAvailable(
    category_id?: string,
    brand?: string,
    name?: string
  ): Promise<Car[]> {
    // --- Código implementado por fora do curso(Explicação no comentário abaixo) ---
    if (!category_id && !brand && !name) {
      const all = this.cars.filter((car) => car.available === true);
      return all;
    }

    let all = this.cars.filter((car) => car.available === true);

    if (category_id) {
      all = all.filter((car) => car.category_id === category_id);
    }

    if (all && brand) {
      all = all.filter((car) => car.brand === brand);
    }

    if (all && name) {
      all = all.filter((car) => car.name === name);
    }

    return all;

    // --- No Curso é feito desta maneira, porém esta errada ---
    // --- Devido a isso, implementei o código a cima ---
    // --- Código da Aula: Chapter IV, Cap 3, Continuação da listagem de carros disponíveis
    // const all = this.cars.filter((car) => {
    //   if (
    //     car.available === true ||
    //     (category_id && car.category_id === category_id) ||
    //     (brand && car.brand === brand) ||
    //     (name && car.name === name)
    //   ) {
    //     return car;
    //   }
    //   return null;
    // });

    // return all;
  }

  async findById(id: string): Promise<Car> {
    return this.cars.find((car) => car.id === id);
  }

  async createSpecification(
    car: Car,
    specifications: Specification[]
  ): Promise<Car> {
    specifications.forEach((specification) =>
      car.specifications.push(specification)
    );
    return car;
  }
}

export { CarsRepositoryInMemory };
