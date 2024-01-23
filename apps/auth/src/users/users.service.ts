import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    return this.usersRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid)
      throw new UnauthorizedException('Invalid Credentials');
    return user;
  }

  async getUser() {}
}
