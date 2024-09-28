import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DATABASE_CONNECTION } from '../database/database-connection';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    createUser: jest.fn(dto => {
      return {
        id: Date.now(),
        ...dto
      }
    }),
    updateUser: jest.fn((id, dto) => {
      return {
        id,
        ...dto
      }
    }),
    getUsers: jest.fn(() => {
      return [
        { id: 1, email: 'user1@gmail.com', password: 'pass1' },
        { id: 2, email: 'user2@gmail.com', password: 'pass2' },
      ]
    }),
    getUserById: jest.fn((id) => {
      return { id: Number(id), email: `user${id}@gmail.com`, password: `pass${id}` };
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, { provide: DATABASE_CONNECTION, useValue: {} }],
    }).overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const dto = {email: 'example2@gmail.com', password: 'example2'};
    const result = await controller.createUser(dto); 

    expect(result).toEqual({
      id: expect.any(Number), 
      ...dto
    });
  });

  it('should update a user', async () => {
    const dto = {email: 'example3@gmail.com', password: 'example3'};
    const result = await controller.updateUser('1', dto);
    expect(result).toEqual({
      id: 1,
      ...dto
    })
  });

  it('should return a list of users', async () => {
    const result = await controller.getUsers();
    
    expect(result).toEqual([
      { id: 1, email: 'user1@gmail.com', password: 'pass1' },
      { id: 2, email: 'user2@gmail.com', password: 'pass2' },
    ]);
  
    expect(mockUsersService.getUsers).toHaveBeenCalled();
  });
  
  it('should return a single user', async () => {
    const userId = '1';
    const result = await controller.getUser(userId);
  
    expect(result).toEqual({
      id: 1,
      email: 'user1@gmail.com',
      password: 'pass1',
    });
  
    expect(mockUsersService.getUserById).toHaveBeenCalledWith(parseInt(userId));
  });
  
});
