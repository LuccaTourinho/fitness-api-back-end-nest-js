import { Test, TestingModule } from '@nestjs/testing';
import { MealsService } from './meals.service';
import { DATABASE_CONNECTION } from '../database/database-connection';

describe('MealsService', () => {
  let service: MealsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MealsService, 
        {
          provide: DATABASE_CONNECTION,
          useValue: {},
        }
      ],
    }).compile();

    service = module.get<MealsService>(MealsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
