/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, Like, ILike } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/response.user.dto';
import { FindOneByGoogleIdTs } from './providers/find-one-by-google-id.ts';
import { GoogleUser } from './interfaces/google-user.interface';
import { MailsService } from 'src/mails/mails.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly findOneByGoogleIdprovider: FindOneByGoogleIdTs,
    private readonly mailService: MailsService,
  ) {}
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUsersByEmail(email: string): Promise<User[]> {
    return await this.userRepository.find({
      where: { email: Like(`%${email}%`) },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    console.log(user);
    return user;
  }
  async findOneAdmin(id: string) {
    const gUser = await this.findUserGroups(id);
    if (!gUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const quantity = gUser.memberships.length;
    const { memberships, groupsCreated, ...rest } = gUser;
    const user = { ...rest, quantity };
    return user;
  }

  async findUserGroups(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['groupsCreated', 'memberships', 'memberships.group'],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async desactivateUser(id: string) {
    const user = await this.findOne(id);
    user.active = false;
    await this.userRepository.save(user);
    return new UserResponseDto(user);
  }
  async activateUser(id: string) {
    const user = await this.findOne(id);
    user.active = true;
    await this.userRepository.save(user);
    return new UserResponseDto(user);
  }
  async modifiedUser(
    id: string,
    user: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const userToModify = await this.findOne(id);
    Object.assign(userToModify, user);
    try {
      const modifiedUser = await this.userRepository.save(userToModify);

      if (!modifiedUser) {
        throw new InternalServerErrorException('No se pudo guardar el usuario');
      }
      const { password: _, ...result } = modifiedUser;
      return result;
    } catch (error) {
      throw new ConflictException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        'Error al actualizar el usuario: ' + error.message,
      );
    }
  }

  public async findByGoogleId(googleId: string) {
    return await this.findOneByGoogleIdprovider.findOneByGoogleId(googleId);
  }

  public async createGoogleUser(googleUser: GoogleUser) {
    try {
      console.log('Este es el google user: ', googleUser);
      const user = this.userRepository.create(googleUser);
      console.log('por mandar mail');
      await this.mailService.sendUserConfirmation({
        name: googleUser.name,
        email: googleUser.email,
      });
      return await this.userRepository.save(user);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new ConflictException(error, {
        description: 'Could not create a new user',
      });
    }
  }

  public async getUsersAdmin(page: number, limit: number, search?: string) {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;
    const [data, total] = await this.userRepository.findAndCount({
      where: search ? { name: ILike(`%${search}%`) } : {},
      skip,
      take,
      order: { created_at: 'DESC' },
    });
    return {
      data,
      total,
      page: Number(page),
      lastPage: Math.ceil(total / take),
    };
  }
}
