import { inject, injectable } from "tsyringe";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  id: string;
  user_id: string;
}

@injectable()
class DevolutionRentalUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,
    @inject("CarsRepository")
    private carsRepository: ICarsRepository,
    @inject("DayjsDateProvider")
    private dayjsDateProvider: IDateProvider
  ) {}

  async execute({ id, user_id }: IRequest): Promise<Rental> {
    const rental = await this.rentalsRepository.findById(id);

    if (!rental) {
      throw new AppError("Rental does not exists!");
    }

    const car = await this.carsRepository.findById(rental.car_id);
    const minimum_daily = 1;
    let total = 0;

    if (!car) {
      throw new AppError("Car does not exists!");
    }

    let daily = this.dayjsDateProvider.compareInDays(
      rental.start_date,
      this.dayjsDateProvider.dateNow()
    );

    // Verifica se o tempo do aluguel foi menos de 1 dia
    if (daily <= 0) {
      daily = minimum_daily;
    }

    // Dias de atraso
    const delay = this.dayjsDateProvider.compareInDays(
      rental.expected_return_date,
      this.dayjsDateProvider.dateNow()
    );

    // Aplicação da multa
    if (delay > 0) {
      const calculate_fine = delay * car.fine_amount;
      total = calculate_fine;
    }

    // Aplicação do valor da diária
    total += daily * car.daily_rate;

    rental.end_date = this.dayjsDateProvider.dateNow();
    rental.total = total;

    await this.rentalsRepository.create(rental);

    await this.carsRepository.updateAvailable(car.id, true);

    return rental;
  }
}

export { DevolutionRentalUseCase };
