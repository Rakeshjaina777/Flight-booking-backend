import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { FlightModule } from './modules/flight/flight.module';
import { BookingModule } from './modules/booking/booking.module';

import { FareModule } from './modules/fare/fare.module';
import { AuthModule } from './modules/auth/auth.module';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { PrismaService } from 'prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
// import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [
    UserModule,
    FlightModule,
    BookingModule,
  
    FareModule,

    AuthModule,
    
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  // exports: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}