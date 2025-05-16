/* eslint-disable prettier/prettier */
// src/group/guards/group-limit.guard.ts
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GroupService } from '../services/group.service';
import { UserService } from 'src/user/user.service';
import { GROUP_LIMIT_KEY } from '../decorators/group-limit.decorator';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';
import { RequestWithUser } from 'src/types/request-with-user';

@Injectable()
export class GroupLimitGuard implements CanActivate {
  constructor(
    private readonly groupService: GroupService,
    private readonly userService: UserService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request[REQUEST_USER_KEY];
    console.log("User es: ", user);
    if (!user?.id) {
      throw new ForbiddenException('No se encontró el usuario en la request.');
    }

    const groupLimit = this.reflector.get<number>(
      GROUP_LIMIT_KEY,
      context.getHandler(),
    ) ?? 3;

    const isPremium = await this.userService.calculateIsPremium(user.id);
    const activeGroups = await this.groupService.countActiveGroupsCreatedByUser(user.id);
    console.log("El usuario es premium: ", isPremium, " | ", "Grupos activos: ", activeGroups);
    if (!isPremium && activeGroups >= groupLimit) {
      throw new ForbiddenException(
        `Límite de ${groupLimit} grupos alcanzado para usuarios no premium.`,
      );
    }

    return true;
  }
}
