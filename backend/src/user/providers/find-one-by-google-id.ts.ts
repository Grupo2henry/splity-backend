import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FindOneByGoogleIdTs {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  public async findOneByGoogleId(googleId: string) {
    return await this.userRepository.findOneBy({ googleId });
  }
}
