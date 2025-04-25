import { Module } from '@nestjs/common';
import { GroupMembershipController } from './group-membership.controller';
import { GroupMembershipService } from './group-membership.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMembership } from './entities/group-membership.entity';
import { GroupMembershipRepository } from './group-membership.repository';
import { UserModule } from 'src/user/user.module';
import { GroupModule } from 'src/group/group.module';

@Module({
  controllers: [GroupMembershipController],
  imports: [
    TypeOrmModule.forFeature([GroupMembership]),
    UserModule,
    GroupModule,
  ],
  providers: [GroupMembershipService, GroupMembershipRepository],
})
export class GroupMembershipModule {}
