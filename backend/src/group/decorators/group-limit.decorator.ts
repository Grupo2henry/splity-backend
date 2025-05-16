/* eslint-disable prettier/prettier */
// src/group/decorators/group-limit.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const GROUP_LIMIT_KEY = 'groupLimit';

export const GroupLimit = (limit: number) => SetMetadata(GROUP_LIMIT_KEY, limit);