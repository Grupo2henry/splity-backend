/* eslint-disable prettier/prettier */
import { Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupController } from './controllers/group.controller';
import { GroupMembershipController } from './controllers/group-membership.controller';
import { GroupService } from './services/group.service';
import { GroupRepository } from './repositories/group.repository';
import { GroupMembershipService } from './services/group-membership.service';
import { GroupMembershipRepository } from './repositories/group-membership.repository';
import { Group } from './entities/group.entity';
import { GroupMembership } from './entities/group-membership.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Group,
      GroupMembership
    ]),
  UserModule
  ],
  controllers: [
    GroupController,
    GroupMembershipController,
  ],
  providers: [
    GroupService,
    GroupMembershipService,
    GroupRepository,
    GroupMembershipRepository
  ],
  exports: [
    GroupService,
    GroupMembershipService,
    GroupRepository,
    GroupMembershipRepository
  ]
})
export class GroupModule {}