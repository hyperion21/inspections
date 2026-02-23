import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { InspectionsService } from 'src/inspections/inspections.service';
import { Repository } from 'typeorm';
import { Inspection, InspectionStatus } from '../inspections/inspection.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Inspection)
    private inspectionsRepo: Repository<Inspection>,
    private readonly inspectionsService: InspectionsService,
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

    const previousRole = user.role;
    Object.assign(user, updateUserDto);
    const updatedUser = await this.usersRepository.save(user);

    if (
      previousRole === UserRole.INSPECTOR &&
      updatedUser.role === UserRole.MANAGER
    ) {
      await this.handleAssignedInspections(user.employeeId);
    }
    return updatedUser;
  }

  async remove(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { employeeId: id },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.isActive)
      throw new BadRequestException('User is already inactive');
    user.isActive = false;
    const updatedUser = await this.usersRepository.save(user);
    if (user.role === UserRole.INSPECTOR) {
      await this.handleAssignedInspections(user.employeeId);
    }

    return updatedUser;
  }

  private async handleAssignedInspections(employeeId: string) {
    const inspections = await this.inspectionsRepo.find({
      where: { assignedInspector: { employeeId } },
    });

    for (const insp of inspections) {
      if (insp.status === InspectionStatus.YET_TO_START) {
        await this.inspectionsService.unassign(insp.id);
      } else if (insp.status === InspectionStatus.IN_PROGRESS) {
        await this.inspectionsService.abandon(insp.id);
      }
    }
  }
}
