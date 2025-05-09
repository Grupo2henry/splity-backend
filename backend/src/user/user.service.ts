/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { Like } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/response.user.dto';
import { GoogleUser } from './interfaces/google-user.interface';
import { MailsService } from 'src/mails/mails.service';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailService: MailsService,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll(); // Usa el método del repositorio
  }

  async findUsersByEmail(email: string): Promise<User[]> {
    return await this.userRepository.find({ // Usa el método del repositorio
      where: { email: Like(`%${email}%`) },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id); // Usa el método del repositorio
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findUserGroups(id: string): Promise<Omit<User, 'password'>> { //Metodo muy similar en groups y memberships
    const user = await this.userRepository.findUserWithGroups(id); // 👈 Llama al nuevo método del repositorio
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async desactivateUser(id: string) {
    const user = await this.findOne(id);
    user.active = false;
    const updatedUser = await this.userRepository.save(user); // Usa el método del repositorio
    return new UserResponseDto(updatedUser);
  }

  async modifiedUser(
    id: string,
    user: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const userToModify = await this.findOne(id);
    Object.assign(userToModify, user);
    try {
      const modifiedUser = await this.userRepository.save(userToModify); // Usa el método del repositorio

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
    return await this.userRepository.save(user); // Usa el método del repositorio
  }

  public async findByGoogleId(googleId: string) {
    return await this.userRepository.findOneByGoogleId(googleId); // Usa el método del repositorio
  }

  public async createGoogleUser(googleUser: GoogleUser) {
    try {
      console.log("Este es el google user: ", googleUser)
      const user = await this.userRepository.createGoogleUser(googleUser); // 👈 Llama al método del repositorio
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
}
