/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/response-user.dto';
import { GoogleUser } from './interfaces/google-user.interface';
import { MailsService } from 'src/mails/mails.service';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { FindOneOptions } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailService: MailsService,
  ) {}

  async createUserWithHashedPassword(credentials: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(credentials.password, 10);
    const newUser = this.userRepository['userRepository'].create({
      ...credentials,
      password: hashedPassword,
    });
    return await this.userRepository['userRepository'].save(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async findUsersByEmail(email: string): Promise<User[]> {
    return await this.userRepository.findUsersByEmail(email)
  }

  async findOne(id: string, options?: FindOneOptions<User>): Promise<User> {
  const user = await this.userRepository.findOne(id, options);
  if (!user) {
    throw new NotFoundException(`User with id ${id} not found`);
  }
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
    const updatedUser = await this.userRepository.save(user);
    return new UserResponseDto(updatedUser);
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

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  public async findByGoogleId(googleId: string) {
    return await this.userRepository.findOneByGoogleId(googleId);
  }

  public async createGoogleUser(googleUser: GoogleUser) {
    try {
      console.log("Este es el google user: ", googleUser)
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
  async calculateIsPremium(userId: string): Promise<boolean> {
    const user = await this.findOne(userId, { relations: ['subscriptions'] });

    if (!user || !user.subscriptions) return false;

    const now = new Date();
    return user.subscriptions.some(
      (sub) => sub.active && (!sub.ends_at || new Date(sub.ends_at) > now),
    );
  }
}
