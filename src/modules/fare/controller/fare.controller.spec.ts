import { Test, TestingModule } from '@nestjs/testing';
import { FareController } from './fare.controller';

describe('FareController', () => {
  let controller: FareController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FareController],
    }).compile();

    controller = module.get<FareController>(FareController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
