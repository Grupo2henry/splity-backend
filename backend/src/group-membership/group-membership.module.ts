import { Module } from '@nestjs/common';
import { GroupMembershipController } from './group-membership.controller';
import { GroupMembershipService } from './group-membership.service';

@Module({
  controllers: [GroupMembershipController],
  providers: [GroupMembershipService]
})
export class GroupMembershipModule {}
