import { Test, TestingModule } from '@nestjs/testing';
import { PrdService } from './prd.service';

describe('PrdService', () => {
  let service: PrdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrdService],
    }).compile();

    service = module.get<PrdService>(PrdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
