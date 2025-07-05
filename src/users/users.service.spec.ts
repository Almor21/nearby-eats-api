import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/createuser.dto';
import { User } from 'src/database/entities/user.entity';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: jest.Mocked<Pick<Repository<User>, 'create' | 'save'>>;

  beforeEach(async () => {
    userRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('debería crear y retornar el usuario sin el password', async () => {
    const dto: CreateUserDto = {
      firstName: 'Edinson',
      lastName: 'Noriega',
      email: 'edi@example.com',
      username: 'almor',
      password: '123456',
    };

    const fakeUser: User = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    userRepository.create.mockReturnValue(fakeUser);
    userRepository.save.mockResolvedValue(fakeUser);

    const result = await usersService.create(dto);

    expect(userRepository.create).toHaveBeenCalledWith(dto);
    expect(userRepository.save).toHaveBeenCalledWith(fakeUser);

    expect(result).toEqual({
      id: fakeUser.id,
      firstName: fakeUser.firstName,
      lastName: fakeUser.lastName,
      email: fakeUser.email,
      username: fakeUser.username,
      createdAt: fakeUser.createdAt,
      updatedAt: fakeUser.updatedAt,
    });

    expect((result as any).password).toBeUndefined();
  });
});
