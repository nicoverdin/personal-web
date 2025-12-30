import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../common/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(() => 'token_falso_de_prueba'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should hash the password and create a user', async () => {
      const dto = { name: 'Nico', email: 'test@test.com', password: '123' };
      
      (bcrypt.hash as jest.Mock).mockResolvedValue('password_encriptada');
      
      mockPrismaService.user.create.mockResolvedValue({
        id: '1',
        ...dto,
        password: 'password_encriptada',
      });

      const result = await service.register(dto);

      expect(bcrypt.hash).toHaveBeenCalled();
      expect(mockPrismaService.user.create).toHaveBeenCalled();
      expect(result).not.toHaveProperty('password');
      expect(result.email).toEqual(dto.email);
    });

    it('should throw ConflictException if email exists', async () => {
      const dto = { name: 'Nico', email: 'existente@test.com', password: '123' };
      
      mockPrismaService.user.create.mockRejectedValue({ code: 'P2002' });

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return a token if credentials are valid', async () => {
      const dto = { email: 'test@test.com', password: '123' };
      const userInDb = { 
        id: '1', 
        email: 'test@test.com', 
        password: 'password_encriptada', 
        name: 'Nico' 
      };

      mockPrismaService.user.findUnique.mockResolvedValue(userInDb);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(dto);

      expect(jwtService.sign).toHaveBeenCalled();
      expect(result).toHaveProperty('access_token', 'token_falso_de_prueba');
    });

    it('should throw UnauthorizedException if password is wrong', async () => {
      const dto = { email: 'test@test.com', password: 'wrong' };
      const userInDb = { email: 'test@test.com', password: 'hash' };

      mockPrismaService.user.findUnique.mockResolvedValue(userInDb);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });
});