import { Test, TestingModule } from '@nestjs/testing';
import { LiquidsService } from './liquids.service';

describe('LiquidsService', () => {
  let service: LiquidsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiquidsService],
    }).compile();

    service = module.get<LiquidsService>(LiquidsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
