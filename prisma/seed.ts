import {
  PrismaClient,
  SeatClass,
  FlightStatus,
  UserRole,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {


  console.log('--------🌱 Seeding database...-------');

  // 1️ Create Admin & Users


  const password = await bcrypt.hash('password123', 10);

  const [admin, user1, user2] = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Rakesh  User',

        email: 'rakesh@example.com',

        age: 40,
        role: UserRole.ADMIN,
        password,
      },
    }),


    prisma.user.create({
      data: {
        name: 'Ravi Mehra',
        email: 'ravi@example.com',

        age: 65,
        role: UserRole.USER,
        password,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Ananya Sharma',
        email: 'ananya@example.com',

        age: 28,
        role: UserRole.USER,
        password,
      },
    }),
  ]);

  // 2️ Create Fares

  const fares = await Promise.all([
    prisma.fare.create({
      data: { economy: 2500, business: 5000, first: 9000 },
    }),
    prisma.fare.create({
      data: { economy: 3000, business: 5500, first: 10000 },
    }),
  ]);

  // 3️ Create Flights


  const flights = await Promise.all([
    prisma.flight.create({
      data: {
        from: 'Delhi',
        to: 'Mumbai',
        departure: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), 

        arrival: new Date(Date.now() + 1000 * 60 * 60 * 25),

        status: FlightStatus.ON_TIME,

        fareId: fares[0].id,
      },
    }),
    prisma.flight.create({
      data: {
        from: 'Bangalore',

        to: 'Hyderabad',

        departure: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
        arrival: new Date(Date.now() + 1000 * 60 * 60 * 26),
        status: FlightStatus.ON_TIME,
        fareId: fares[1].id,
      },
    }),
  ]);

  // 4️ Create Seats for Each Flight
  for (const flight of flights) {
    const economySeats = Array.from({ length: 30 }, (_, i) => ({
      seatNumber: `E${i + 1}`,
      seatClass: SeatClass.ECONOMY,
      flightId: flight.id,
    }));
    const businessSeats = Array.from({ length: 10 }, (_, i) => ({
      seatNumber: `B${i + 1}`,
      seatClass: SeatClass.BUSINESS,
      flightId: flight.id,
    }));
    const firstSeats = Array.from({ length: 5 }, (_, i) => ({
      seatNumber: `F${i + 1}`,

      seatClass: SeatClass.FIRST,

      flightId: flight.id,
    }));

    await prisma.seat.createMany({
      data: [...economySeats, ...businessSeats, ...firstSeats],
    });
  }

  console.log('--------------✅ Database seeded successfully!');
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
