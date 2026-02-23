import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(role?: UserRole) {
    if (role) {
      return this.usersRepository.find({
        where: { role },
      });
    }
    return this.usersRepository.find();
  }

  async findByEmployeeId(employeeId: string) {
    return await this.usersRepository.findOne({ where: { employeeId } });
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Hashed password:', hashedPassword);
    return hashedPassword;
  }

  async getUserProfile(employeeId: string): Promise<User> {
    const user = await this.findByEmployeeId(employeeId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findByEmployeeId(createUserDto.employeeId);
    if (user) throw new BadRequestException('User already exists');

    const newUser = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(newUser);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { employeeId: id },
    });
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { employeeId: id },
    });
    if (!user) throw new NotFoundException('User not found');

    await this.usersRepository.remove(user);
  }
}
