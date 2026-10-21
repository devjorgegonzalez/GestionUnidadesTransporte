import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ('ADMIN' | 'CONDUCTOR')[]) =>
  SetMetadata(ROLES_KEY, roles);
