import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ('ADMIN' | 'GESTOR' | 'CONDUCTOR')[]) =>
  SetMetadata(ROLES_KEY, roles);
