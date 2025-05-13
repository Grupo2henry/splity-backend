/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, Like, ILike } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/response-user.dto';
import { GoogleUser } from './interfaces/google-user.interface';
import { MailsService } from 'src/mails/mails.service';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly typeOrmUserRepository: Repository<User>, // Repositorio genérico de TypeORM
    private readonly userRepository: UserRepository, // Repositorio personalizado
    private readonly mailService: MailsService,
  ) {}

  async createUserWithHashedPassword(
    credentials: CreateUserDto,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(credentials.password, 10);
    const newUser = this.typeOrmUserRepository.create({
      ...credentials,
      password: hashedPassword,
    });
    return await this.typeOrmUserRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async findUsersByEmail(email: string): Promise<User[]> {
    return await this.userRepository.findUsersByEmail(email);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);
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
    const { memberships, ...rest } = gUser;
    const user = { ...rest, quantity };
    return user;
  }

  async findOneByEmail(email: string): Promise<User | null | undefined> {
    return await this.userRepository.findUserByEmail(email);
  }

  async findUserGroups(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findUserWithGroups(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async desactivateUser(id: string) {
    const user = await this.findOne(id);
    user.active = false;
    const updatedUser = await this.typeOrmUserRepository.save(user);
    return new UserResponseDto(updatedUser);
  }

  async activateUser(id: string) {
    const user = await this.findOne(id);
    user.active = true;
    const updatedUser = await this.typeOrmUserRepository.save(user);
    return new UserResponseDto(updatedUser);
  }

  async modifiedUser(
    id: string,
    user: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const userToModify = await this.findOne(id);
    Object.assign(userToModify, user);
    try {
      const modifiedUser = await this.typeOrmUserRepository.save(userToModify);
      if (!modifiedUser) {
        throw new InternalServerErrorException('No se pudo guardar el usuario');
      }
      const { password: _, ...result } = modifiedUser;
      return result;
    } catch (error) {
      throw new ConflictException(
        'Error al actualizar el usuario: ' + error.message,
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return await this.typeOrmUserRepository.save(user);
  }

  public async findByGoogleId(googleId: string) {
    return await this.userRepository.findOneByGoogleId(googleId);
  }

  public async createGoogleUser(googleUser: GoogleUser) {
    try {
      console.log('Este es el google user: ', googleUser);
      const user = await this.userRepository.createGoogleUser(googleUser);
      await this.mailService.sendUserConfirmation({
        name: googleUser.name,
        email: googleUser.email,
      });
      return user;
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
    const [data, total] = await this.typeOrmUserRepository.findAndCount({
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
