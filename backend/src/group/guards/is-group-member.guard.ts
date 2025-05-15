/* eslint-disable prettier/prettier */
// src/group/guards/is-group-member.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { GroupMembershipService } from '../services/group-membership.service';
import { RequestWithUser } from 'src/types/request-with-user';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class IsGroupMemberGuard implements CanActivate {
  constructor(
    private readonly groupMembershipService: GroupMembershipService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request[REQUEST_USER_KEY];
    const groupId = parseInt(request.params.id);

    if (!user || !groupId) {
      throw new ForbiddenException('Faltan datos de autenticación o grupo.');
    }

    const members = await this.groupMembershipService.findMembersByGroup(groupId);
    const isMember = members.some((member) => member.user.id === user.id);

    if (!isMember) {
      throw new ForbiddenException('No perteneces a este grupo.');
    }

    return true;
  }
}
