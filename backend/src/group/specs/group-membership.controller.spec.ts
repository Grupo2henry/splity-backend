/* eslint-disable prettier/prettier */
// src/group/controllers/group-membership.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { GroupMembershipController } from '../controllers/group-membership.controller';
import { GroupMembershipService } from '../services/group-membership.service';
import { UserService } from '../../user/user.service';
import { GroupService } from '../services/group.service';
import { CreateGroupMembershipDto } from '../dto/create-group-membership.dto';
import { UpdateGroupMembershipDto } from '../dto/update-group-membership.dto';
import { NotFoundException } from '@nestjs/common';

describe('GroupMembershipController', () => {
  let controller: GroupMembershipController;
  let groupMembershipService: jest.Mocked<GroupMembershipService>;
  let userService: jest.Mocked<UserService>;
  let groupService: jest.Mocked<GroupService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupMembershipController],
      providers: [
        {
          provide: GroupMembershipService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findGroupsByUser: jest.fn(),
            findMembersByGroup: jest.fn(),
            findByUserAndGroup: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: GroupService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GroupMembershipController>(GroupMembershipController);
    groupMembershipService = module.get(GroupMembershipService);
    userService = module.get(UserService);
    groupService = module.get(GroupService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a group membership successfully', async () => {
      const createDto: CreateGroupMembershipDto = {
        userId: 'user-1',
        groupId: 1,
        status: 'active',
      };

      const user = { id: 'user-1' };
      const group = { id: 1 };
      const membership = { id: 1, user, group, status: 'active' };

      userService.findOne.mockResolvedValue(user as any);
      groupService.findOne.mockResolvedValue(group as any);
      groupMembershipService.findByUserAndGroup.mockResolvedValue(null);
      groupMembershipService.create.mockResolvedValue(membership as any);

      const result = await controller.create(createDto);

      expect(result).toEqual({
        message: 'Membresía creada exitosamente',
        membership,
      });
      expect(userService.findOne).toHaveBeenCalledWith('user-1');
      expect(groupService.findOne).toHaveBeenCalledWith(1);
      expect(groupMembershipService.create).toHaveBeenCalledWith(createDto, user, group);
    });

    it('should throw NotFoundException if user not found', async () => {
      userService.findOne.mockResolvedValue(null);

      await expect(
        controller.create({ userId: 'user-1', groupId: 1, status: 'active' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if group not found', async () => {
      userService.findOne.mockResolvedValue({ id: 'user-1' } as any);
      groupService.findOne.mockResolvedValue(null);

      await expect(
        controller.create({ userId: 'user-1', groupId: 1, status: 'active' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw Error if membership already exists', async () => {
      userService.findOne.mockResolvedValue({ id: 'user-1' } as any);
      groupService.findOne.mockResolvedValue({ id: 1 } as any);
      groupMembershipService.findByUserAndGroup.mockResolvedValue({ id: 1 } as any);

      await expect(
        controller.create({ userId: 'user-1', groupId: 1, status: 'active' }),
      ).rejects.toThrow('El usuario ya es miembro del grupo.');
    });
  });

  describe('findAll', () => {
    it('should return all group memberships', async () => {
      const memberships = [{ id: 1 }, { id: 2 }];
      groupMembershipService.findAll.mockResolvedValue(memberships as any);

      const result = await controller.findAll();

      expect(result).toEqual(memberships);
      expect(groupMembershipService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a group membership by id', async () => {
      const membership = { id: 1 };
      groupMembershipService.findOne.mockResolvedValue(membership as any);

      const result = await controller.findOne(1);

      expect(result).toEqual(membership);
      expect(groupMembershipService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a group membership', async () => {
      const updateDto: UpdateGroupMembershipDto = { status: 'inactive' };
      const updatedMembership = { id: 1, status: 'inactive' };

      groupMembershipService.update.mockResolvedValue(updatedMembership as any);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(updatedMembership);
      expect(groupMembershipService.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a group membership', async () => {
      groupMembershipService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(groupMembershipService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('findGroupsByUser', () => {
    it('should return groups by user id', async () => {
      const groups = [{ id: 1, name: 'Grupo 1' }];
      groupMembershipService.findGroupsByUser.mockResolvedValue(groups as any);

      const result = await controller.findGroupsByUser('user-1');

      expect(result).toEqual(groups);
      expect(groupMembershipService.findGroupsByUser).toHaveBeenCalledWith('user-1');
    });
  });

  describe('findMembersByGroup', () => {
    it('should return members by group id', async () => {
      const members = [{ id: 1, name: 'Gonzalo' }];
      groupMembershipService.findMembersByGroup.mockResolvedValue(members as any);

      const result = await controller.findMembersByGroup(1);

      expect(result).toEqual(members);
      expect(groupMembershipService.findMembersByGroup).toHaveBeenCalledWith(1);
    });
  });

  describe('findByUserAndGroup', () => {
    it('should return membership by user and group', async () => {
      const membership = { id: 1 };
      groupMembershipService.findByUserAndGroup.mockResolvedValue(membership as any);

      const result = await controller.findByUserAndGroup('user-1', 1);

      expect(result).toEqual(membership);
      expect(groupMembershipService.findByUserAndGroup).toHaveBeenCalledWith('user-1', 1);
    });
  });
});
