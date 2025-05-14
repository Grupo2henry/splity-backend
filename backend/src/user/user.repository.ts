/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository, Like, FindOneOptions} from "typeorm";
import { GoogleUser } from "./interfaces/google-user.interface";

@Injectable()
export class UserRepository{
  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
    ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOneByGoogleId(googleId: string): Promise<User | null | undefined> {
    return await this.userRepository.findOneBy({ google_id: googleId }); // 👈 Corrección aquí
  }

  async findOne(id: string, options?: FindOneOptions<User>): Promise<User | null | undefined> {
  return await this.userRepository.findOne({
    where: { id },
    ...options,
  });
}

  async findUserByEmail(email: string): Promise <User | null | undefined>{
    return await this.userRepository.findOne({
      where: { email: email },
    })
  }
  
  async findUsersByEmail(email: string): Promise<User[]> {
    return await this.userRepository.find({
      where: {
        email: Like(`%${email}%`),
      },
    });
  }

  async findUserWithGroups(id: string): Promise<User | null | undefined> {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['groups_created', 'memberships', 'memberships.group'],
    });
  }

  async save(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async createGoogleUser(googleUser: GoogleUser): Promise<User> {
    const newUser = this.userRepository.create(googleUser);
    return await this.userRepository.save(newUser);
  }
}