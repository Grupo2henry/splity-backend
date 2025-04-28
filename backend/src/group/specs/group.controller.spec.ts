/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { GroupController } from '../controllers/group.controller';
import { GroupService } from '../services/group.service';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { NotFoundException } from '@nestjs/common';

describe('GroupController', () => {
  let controller: GroupController;
  let service: GroupService;

  const mockGroupService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupController],
      providers: [
        {
          provide: GroupService,
          useValue: mockGroupService,
        },
      ],
    }).compile();

    controller = module.get<GroupController>(GroupController);
    service = module.get<GroupService>(GroupService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new group', async () => {
      const createGroupDto: CreateGroupDto = { name: 'Test Group' };
      const mockUser = { id: 1, email: 'test@example.com' };

      const expectedResult = { id: 1, name: 'Test Group', createdBy: mockUser.id };
      mockGroupService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createGroupDto, { user: mockUser });

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createGroupDto, mockUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of groups', async () => {
      const groups = [{ id: 1, name: 'Group 1' }, { id: 2, name: 'Group 2' }];
      mockGroupService.findAll.mockResolvedValue(groups);

      const result = await controller.findAll();

      expect(result).toEqual(groups);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single group', async () => {
      const group = { id: 1, name: 'Group 1' };
      mockGroupService.findOne.mockResolvedValue(group);

      const result = await controller.findOne(1);

      expect(result).toEqual(group);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if group not found', async () => {
      mockGroupService.findOne.mockRejectedValue(new NotFoundException('Group not found'));

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('update', () => {
    it('should update and return the group', async () => {
      const updateGroupDto: UpdateGroupDto = { name: 'Updated Group' };
      const updatedGroup = { id: 1, name: 'Updated Group' };

      mockGroupService.update.mockResolvedValue(updatedGroup);

      const result = await controller.update(1, updateGroupDto);

      expect(result).toEqual(updatedGroup);
      expect(service.update).toHaveBeenCalledWith(1, updateGroupDto);
    });

    it('should throw NotFoundException if group to update does not exist', async () => {
      const updateGroupDto: UpdateGroupDto = { name: 'Updated Group' };

      mockGroupService.update.mockRejectedValue(new NotFoundException('Group not found'));

      await expect(controller.update(999, updateGroupDto)).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(999, updateGroupDto);
    });
  });

  describe('remove', () => {
    it('should remove the group', async () => {
      mockGroupService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if group to remove does not exist', async () => {
      mockGroupService.remove.mockRejectedValue(new NotFoundException('Group not found'));

      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(999);
    });
  });
});
