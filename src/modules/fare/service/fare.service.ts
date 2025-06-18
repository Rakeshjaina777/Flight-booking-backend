import { Injectable, NotFoundException } from '@nestjs/common';

import { CalculateFareDto } from '../dto/calculate-fare.dto';
import { calculateFinalFare } from 'src/common/utils/fare-calculator.util';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class FareService {
  constructor(private prisma: PrismaService) {}

  async setBaseFare(
    flightId: string,
    economy: number,
    business: number,
    first: number,
  ) {
    const fare = await this.prisma.fare.create({
      data: { economy, business, first },
    });
    await this.prisma.flight.update({
      where: { id: flightId },
      data: { fareId: fare.id },
    });
    return fare;
  }

  async calculate(dto: CalculateFareDto) {
    const flight = await this.prisma.flight.findUnique({
      where: { id: dto.flightId },
      include: { fare: true },
    });

    if (!flight || !flight.fare)
      throw new NotFoundException('Flight or fare not found');

    const baseFare = flight.fare[dto.seatClass.toLowerCase()];
    const { finalFare, breakdown } = calculateFinalFare({
      baseFare,
      isWindow: dto.isWindow,
      age: dto.passengerAge,
      bookedSeats: dto.bookedSeats,
      totalSeats: dto.totalSeats,
      timeBeforeDepartureInMinutes: dto.timeBeforeDepartureInMinutes,
    });

    return { finalFare, breakdown };
  }
}
