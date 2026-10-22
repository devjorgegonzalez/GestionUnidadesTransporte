import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsuariosService } from './usuarios.service.js';
import { UsuarioAdmin } from '../database/schemas/usuario-admin.schema.js';
import { ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let mockAdminModel: any;

  beforeEach(async () => {
    mockAdminModel = {
      countDocuments: vi.fn(),
      find: vi.fn(),
      findById: vi.fn(),
      findOne: vi.fn(),
      create: vi.fn(),
      findByIdAndDelete: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        {
          provide: getModelToken(UsuarioAdmin.name),
          useValue: mockAdminModel,
        },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debe lanzar ConflictException si el correo ya existe', async () => {
      mockAdminModel.findOne.mockResolvedValue({ email: 'existente@empresa.com' });

      await expect(
        service.create({
          nombre: 'Test',
          email: 'existente@empresa.com',
          password: 'Password123*',
          rol: 'GESTOR',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('debe crear un usuario gestor exitosamente', async () => {
      mockAdminModel.findOne.mockResolvedValue(null);
      mockAdminModel.create.mockResolvedValue({
        toObject: () => ({
          _id: 'user123',
          nombre: 'Gestor Test',
          email: 'gestor@empresa.com',
          rol: 'GESTOR',
          activo: true,
          passwordHash: 'hashed',
        }),
      });

      const result = await service.create({
        nombre: 'Gestor Test',
        email: 'gestor@empresa.com',
        password: 'Password123*',
        rol: 'GESTOR',
      });

      expect(result.rol).toBe('GESTOR');
      expect((result as any).passwordHash).toBeUndefined();
    });
  });

  describe('update', () => {
    it('debe impedir que un admin degrade su propio rol', async () => {
      const mockUser = {
        _id: 'admin1',
        email: 'admin@empresa.com',
        rol: 'ADMIN',
        activo: true,
        save: vi.fn(),
        toObject: () => ({ _id: 'admin1', rol: 'ADMIN' }),
      };
      mockAdminModel.findById.mockResolvedValue(mockUser);

      await expect(
        service.update('admin1', { rol: 'GESTOR' }, 'admin1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('debe impedir desactivar al único admin activo', async () => {
      const mockUser = {
        _id: 'admin2',
        email: 'admin2@empresa.com',
        rol: 'ADMIN',
        activo: true,
        save: vi.fn(),
        toObject: () => ({ _id: 'admin2', rol: 'ADMIN' }),
      };
      mockAdminModel.findById.mockResolvedValue(mockUser);
      mockAdminModel.countDocuments.mockResolvedValue(1);

      await expect(
        service.update('admin2', { activo: false }, 'admin1'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
