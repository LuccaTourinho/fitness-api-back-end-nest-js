import { Test, TestingModule } from '@nestjs/testing';
import { LiquidsController } from './liquids.controller';

describe('LiquidsController', () => {
  let controller: LiquidsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiquidsController],
    }).compile();

    controller = module.get<LiquidsController>(LiquidsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
