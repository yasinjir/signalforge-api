import { Test, TestingModule } from '@nestjs/testing';
import { PrdController } from './prd.controller';

describe('PrdController', () => {
  let controller: PrdController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrdController],
    }).compile();

    controller = module.get<PrdController>(PrdController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
