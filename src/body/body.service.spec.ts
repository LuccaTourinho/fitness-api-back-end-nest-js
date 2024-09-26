import { Test, TestingModule } from '@nestjs/testing';
import { BodyService } from './body.service';

describe('BodyService', () => {
  let service: BodyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BodyService],
    }).compile();

    service = module.get<BodyService>(BodyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
