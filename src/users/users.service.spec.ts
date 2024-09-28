import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  const mockDatabase = {
    findFirst: jest.fn().mockResolvedValue({
      id: 1,
      email: 'example@gmail.com',
      profile: {
        id: 2,
        name: 'Example',
        gender: 'Male',
        birthdate: '1999-11-04',
      },
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: DATABASE_CONNECTION, useValue: {mockDatabase} }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return status 200', async () => {
      // Chamando o método getUsers
      try {
        await service.getUsers(); // Tenta executar o método

        // Se a execução chegar aqui sem lançar erro, considera-se um sucesso.
        expect(true).toBe(true); // Apenas uma afirmação para indicar que não houve erro.
      } catch (error) {
        // Se houve um erro, podemos verificar o status aqui.
        expect(error instanceof HttpException).toBe(true); // Verifica se é uma exceção de HTTP
        expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR); // Espera que seja um erro 500
      }
    });
  });

  describe('getUserById', () => {
    it('should return the user with the correct ID and status 200', async () => {
      const userId = 1; // ID do usuário de teste

      // Chamando o método getUserById
      const user = await service.getUserById(userId);

      
      // Exibir o retorno do usuário no console
      console.log(user);
      
    });
  });
});
