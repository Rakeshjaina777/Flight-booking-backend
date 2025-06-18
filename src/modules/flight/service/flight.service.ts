import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFlightDto } from '../dto/create-flight.dto';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateFlightStatusDto } from '../dto/update-flight-status.dto';

@Injectable()
export class FlightService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFlightDto) {
    // Optional: check if fareId exists before attaching it
    if (dto.fareId) {
      const fareExists = await this.prisma.fare.findUnique({
        where: { id: dto.fareId },
      });
      if (!fareExists) {
        throw new NotFoundException('Fare ID not found');
      }
    }

    return this.prisma.flight.create({
      data: {
        from: dto.from,
        to: dto.to,
        departure: new Date(dto.departure),
        arrival: new Date(dto.arrival),
        fareId: dto.fareId,
      },
    });
  }

  findAll() {
    return this.prisma.flight.findMany({
      include: { fare: true, seats: true },
    });
  }

  findFiltered(from: string, to: string, date: string) {
    return this.prisma.flight.findMany({
      where: {
        from: { equals: from, mode: 'insensitive' },
        to: { equals: to, mode: 'insensitive' },
        departure: {
          gte: new Date(date + 'T00:00:00Z'),
          lt: new Date(date + 'T23:59:59Z'),
        },
      },
      include: {
        fare: true,
        seats: {
          where: { isBooked: false },
        },
      },
    });
  }

  async updateStatus(id: string, dto: UpdateFlightStatusDto) {
    const flight = await this.prisma.flight.findUnique({ where: { id } });
    if (!flight) throw new NotFoundException('Flight not found');
    return this.prisma.flight.update({
      where: { id },
      data: { status: dto.status },
    });
  }
}
