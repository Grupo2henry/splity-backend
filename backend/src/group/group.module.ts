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
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Group,
      GroupMembership
    ]),
  UserModule,
  AuthModule,
  JwtModule,
  ConfigModule.forFeature(jwtConfig)
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