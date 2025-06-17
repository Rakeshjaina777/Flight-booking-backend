import { Test, TestingModule } from '@nestjs/testing';
import { FareService } from './fare.service';

describe('FareService', () => {
  let service: FareService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FareService],
    }).compile();

    service = module.get<FareService>(FareService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
