/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { GoogleUser } from "./interfaces/google-user.interface";

@Injectable()
export class UserRepository {
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

  async findOne(id: string): Promise<User | null | undefined> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async find(options: any): Promise<User[]> {
    return await this.userRepository.find(options);
  }

  async findUserWithGroups(id: string): Promise<User | null | undefined> {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['groupsCreated', 'memberships', 'memberships.group'],
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